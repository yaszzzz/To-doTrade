
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { backtestStrategies, backtestTrades } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type BacktestResult = "win" | "loss" | "breakeven";

export async function getBacktestStrategies() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return db.query.backtestStrategies.findMany({
    where: eq(backtestStrategies.userId, session.user.id),
    with: {
      backtestTrades: true,
    },
    orderBy: desc(backtestStrategies.createdAt),
  });
}

export async function getBacktestStrategyById(strategyId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const strategy = await db.query.backtestStrategies.findFirst({
    where: and(
      eq(backtestStrategies.id, strategyId),
      eq(backtestStrategies.userId, session.user.id)
    ),
    with: {
      backtestTrades: {
        orderBy: desc(backtestTrades.entryDate),
      },
    },
  });

  if (!strategy) {
    throw new Error("Backtest strategy not found");
  }

  return strategy;
}

export async function createBacktestStrategy(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const strategyName = formData.get("strategyName") as string;
    const market = formData.get("market") as string;
    const timeframe = formData.get("timeframe") as string;
    const rrTarget = formData.get("rrTarget") as string;
    const description = formData.get("description") as string;

    if (!strategyName || !market || !timeframe || !rrTarget) {
      return { error: "Strategy name, market, timeframe, and RR target are required" };
    }

    const [strategy] = await db
      .insert(backtestStrategies)
      .values({
        userId: session.user.id,
        strategyName,
        market,
        timeframe,
        rrTarget,
        description: description || null,
      })
      .returning();

    revalidatePath("/backtest");

    return { success: true, strategyId: strategy.id };
  } catch (error) {
    console.error("Create backtest strategy error:", error);
    return { error: "Failed to create backtest strategy" };
  }
}

export async function addBacktestTrade(strategyId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const strategy = await db.query.backtestStrategies.findFirst({
      where: and(
        eq(backtestStrategies.id, strategyId),
        eq(backtestStrategies.userId, session.user.id)
      ),
      with: {
        backtestTrades: true,
      },
    });

    if (!strategy) {
      return { error: "Backtest strategy not found" };
    }

    const pair = formData.get("pair") as string;
    const entryDate = formData.get("entryDate") as string;
    const result = formData.get("result") as BacktestResult;
    const rrAchieved = formData.get("rrAchieved") as string;
    const screenshot = formData.get("screenshot") as string;

    if (!pair || !entryDate || !result || !rrAchieved) {
      return { error: "Pair, entry date, result, and RR achieved are required" };
    }

    await db.insert(backtestTrades).values({
      strategyId,
      tradeNumber: strategy.backtestTrades.length + 1,
      pair: pair.toUpperCase(),
      entryDate: new Date(entryDate),
      result,
      rrAchieved,
      screenshot: screenshot || null,
    });

    revalidatePath("/backtest");
    revalidatePath(`/backtest/${strategyId}`);

    return { success: true };
  } catch (error) {
    console.error("Add backtest trade error:", error);
    return { error: "Failed to add backtest trade" };
  }
}

export async function deleteBacktestTrade(strategyId: string, tradeId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const strategy = await db.query.backtestStrategies.findFirst({
      where: and(
        eq(backtestStrategies.id, strategyId),
        eq(backtestStrategies.userId, session.user.id)
      ),
    });

    if (!strategy) {
      return { error: "Backtest strategy not found" };
    }

    await db.delete(backtestTrades).where(eq(backtestTrades.id, tradeId));

    revalidatePath("/backtest");
    revalidatePath(`/backtest/${strategyId}`);

    return { success: true };
  } catch (error) {
    console.error("Delete backtest trade error:", error);
    return { error: "Failed to delete backtest trade" };
  }
}

export async function calculateBacktestStats(
  trades: Array<{
    result: BacktestResult;
    rrAchieved: string;
  }>
) {
  const totalTrades = trades.length;
  const wins = trades.filter((trade) => trade.result === "win").length;
  const losses = trades.filter((trade) => trade.result === "loss").length;
  const breakevens = trades.filter((trade) => trade.result === "breakeven").length;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

  const rrValues = trades.map((trade) => Number(trade.rrAchieved) || 0);
  const averageRR =
    totalTrades > 0
      ? rrValues.reduce((sum, rr) => sum + rr, 0) / totalTrades
      : 0;

  const grossProfit = rrValues
    .filter((rr) => rr > 0)
    .reduce((sum, rr) => sum + rr, 0);
  const grossLoss = Math.abs(
    rrValues.filter((rr) => rr < 0).reduce((sum, rr) => sum + rr, 0)
  );
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? grossProfit : 0;
  const expectancy = averageRR;

  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;
  let consecutiveWins = 0;
  let consecutiveLosses = 0;
  let currentWins = 0;
  let currentLosses = 0;

  for (const trade of trades) {
    const rr = Number(trade.rrAchieved) || 0;
    equity += rr;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, peak - equity);

    if (trade.result === "win") {
      currentWins += 1;
      currentLosses = 0;
    } else if (trade.result === "loss") {
      currentLosses += 1;
      currentWins = 0;
    } else {
      currentWins = 0;
      currentLosses = 0;
    }

    consecutiveWins = Math.max(consecutiveWins, currentWins);
    consecutiveLosses = Math.max(consecutiveLosses, currentLosses);
  }

  return {
    totalTrades,
    wins,
    losses,
    breakevens,
    winRate,
    averageRR,
    expectancy,
    profitFactor,
    maxDrawdown,
    consecutiveWins,
    consecutiveLosses,
  };
}