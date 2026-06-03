"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { trades } from "@/lib/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export interface AnalyticsData {
  performanceByPair: Array<{
    pair: string;
    totalTrades: number;
    wins: number;
    losses: number;
    winRate: number;
    totalPL: number;
    avgRR: number;
  }>;
  plOverTime: Array<{
    date: string;
    cumulativePL: number;
    tradePL: number;
  }>;
  winLossDistribution: {
    wins: number;
    losses: number;
    breakeven: number;
  };
  tradeFrequency: Array<{
    period: string;
    count: number;
  }>;
}

export async function getAnalytics(filters?: {
  startDate?: Date;
  endDate?: Date;
  pair?: string;
  marketType?: string;
}): Promise<AnalyticsData> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Build where conditions
  const conditions = [eq(trades.userId, session.user.id)];

  if (filters?.startDate) {
    conditions.push(gte(trades.tradeDate, filters.startDate));
  }

  if (filters?.endDate) {
    conditions.push(lte(trades.tradeDate, filters.endDate));
  }

  if (filters?.pair) {
    conditions.push(eq(trades.pair, filters.pair));
  }

  if (filters?.marketType) {
    conditions.push(
      eq(trades.marketType, filters.marketType as "crypto_futures" | "crypto_spot" | "saham")
    );
  }

  // Get all trades with filters
  const allTrades = await db
    .select()
    .from(trades)
    .where(and(...conditions))
    .orderBy(trades.tradeDate);

  // Calculate performance by pair
  const pairMap = new Map<
    string,
    {
      totalTrades: number;
      wins: number;
      losses: number;
      totalPL: number;
      totalRR: number;
    }
  >();

  allTrades.forEach((trade) => {
    const existing = pairMap.get(trade.pair) || {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      totalPL: 0,
      totalRR: 0,
    };

    existing.totalTrades++;
    existing.totalRR += parseFloat(trade.rrRatio);

    if (trade.result === "win") existing.wins++;
    if (trade.result === "loss") existing.losses++;
    if (trade.profitLoss) {
      existing.totalPL += parseFloat(trade.profitLoss);
    }

    pairMap.set(trade.pair, existing);
  });

  const performanceByPair = Array.from(pairMap.entries()).map(
    ([pair, stats]) => ({
      pair,
      totalTrades: stats.totalTrades,
      wins: stats.wins,
      losses: stats.losses,
      winRate:
        stats.wins + stats.losses > 0
          ? (stats.wins / (stats.wins + stats.losses)) * 100
          : 0,
      totalPL: stats.totalPL,
      avgRR: stats.totalTrades > 0 ? stats.totalRR / stats.totalTrades : 0,
    })
  );

  // Calculate P&L over time (cumulative)
  const closedTrades = allTrades.filter((t) => t.result !== null);
  let cumulative = 0;
  const plOverTime = closedTrades.map((trade) => {
    const tradePL = trade.profitLoss ? parseFloat(trade.profitLoss) : 0;
    cumulative += tradePL;
    return {
      date: trade.tradeDate.toISOString().split("T")[0],
      cumulativePL: cumulative,
      tradePL,
    };
  });

  // Win/Loss distribution
  const winLossDistribution = {
    wins: allTrades.filter((t) => t.result === "win").length,
    losses: allTrades.filter((t) => t.result === "loss").length,
    breakeven: allTrades.filter((t) => t.result === "breakeven").length,
  };

  // Trade frequency by month
  const frequencyMap = new Map<string, number>();
  allTrades.forEach((trade) => {
    const month = trade.tradeDate.toISOString().substring(0, 7); // YYYY-MM
    frequencyMap.set(month, (frequencyMap.get(month) || 0) + 1);
  });

  const tradeFrequency = Array.from(frequencyMap.entries())
    .map(([period, count]) => ({ period, count }))
    .sort((a, b) => a.period.localeCompare(b.period));

  return {
    performanceByPair,
    plOverTime,
    winLossDistribution,
    tradeFrequency,
  };
}

// Get unique pairs for filter
export async function getUniquePairs() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .selectDistinct({ pair: trades.pair })
    .from(trades)
    .where(eq(trades.userId, session.user.id))
    .orderBy(trades.pair);

  return result.map((r) => r.pair);
}