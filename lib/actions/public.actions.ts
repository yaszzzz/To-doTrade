"use server";

import { db } from "@/lib/db";
import { backtestStrategies, backtestTrades, signals } from "@/lib/db/schema";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";

export type PublicSignalStatus = "running" | "hit_tp" | "hit_sl" | "cancelled";

export async function getPublicSignals(filters?: {
  status?: PublicSignalStatus | "all";
  search?: string;
}) {
  noStore();

  const whereClauses: SQL[] = [];

  if (filters?.status && filters.status !== "all") {
    whereClauses.push(eq(signals.status, filters.status));
  }

  if (filters?.search) {
    const keyword = `%${filters.search}%`;
    const searchClause = or(
      ilike(signals.pair, keyword),
      ilike(signals.analysis, keyword)
    );

    if (searchClause) {
      whereClauses.push(searchClause);
    }
  }

  const data = await db
    .select({
      id: signals.id,
      pair: signals.pair,
      entry: signals.entry,
      stopLoss: signals.stopLoss,
      takeProfit: signals.takeProfit,
      riskReward: signals.riskReward,
      signalDate: signals.signalDate,
      analysis: signals.analysis,
      chartScreenshot: signals.chartScreenshot,
      status: signals.status,
      result: signals.result,
      rrAchieved: signals.rrAchieved,
      createdAt: signals.createdAt,
    })
    .from(signals)
    .where(whereClauses.length > 0 ? and(...whereClauses) : undefined)
    .orderBy(desc(signals.signalDate))
    .limit(50);

  return data;
}

export async function getPublicSignalById(signalId: string) {
  noStore();

  return db.query.signals.findFirst({
    where: eq(signals.id, signalId),
    columns: {
      id: true,
      pair: true,
      entry: true,
      stopLoss: true,
      takeProfit: true,
      riskReward: true,
      signalDate: true,
      analysis: true,
      chartScreenshot: true,
      status: true,
      result: true,
      rrAchieved: true,
      resultScreenshot: true,
      createdAt: true,
      updatedAt: true,
      userId: false,
      profitLoss: false,
    },
  });
}

export async function getPublicSignalStats() {
  noStore();

  const allSignals = await db
    .select({
      status: signals.status,
      result: signals.result,
      rrAchieved: signals.rrAchieved,
    })
    .from(signals);

  const totalSignals = allSignals.length;
  const runningSignals = allSignals.filter((signal) => signal.status === "running").length;
  const hitTpSignals = allSignals.filter((signal) => signal.status === "hit_tp").length;
  const hitSlSignals = allSignals.filter((signal) => signal.status === "hit_sl").length;
  const completedSignals = allSignals.filter(
    (signal) => signal.status === "hit_tp" || signal.status === "hit_sl"
  );
  const winRate =
    completedSignals.length > 0 ? (hitTpSignals / completedSignals.length) * 100 : 0;
  const averageRR =
    completedSignals.length > 0
      ? completedSignals.reduce((sum, signal) => {
          return sum + (signal.rrAchieved ? Number(signal.rrAchieved) : 0);
        }, 0) / completedSignals.length
      : 0;

  return {
    totalSignals,
    runningSignals,
    hitTpSignals,
    hitSlSignals,
    winRate,
    averageRR,
  };
}

export async function getPublicBacktestStrategies(filters?: { search?: string }) {
  noStore();

  const data = await db.query.backtestStrategies.findMany({
    where: filters?.search
      ? or(
          ilike(backtestStrategies.strategyName, `%${filters.search}%`),
          ilike(backtestStrategies.market, `%${filters.search}%`),
          ilike(backtestStrategies.timeframe, `%${filters.search}%`)
        )
      : undefined,
    columns: {
      id: true,
      strategyName: true,
      market: true,
      timeframe: true,
      rrTarget: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      userId: false,
    },
    with: {
      backtestTrades: {
        columns: {
          id: true,
          tradeNumber: true,
          pair: true,
          entryDate: true,
          result: true,
          rrAchieved: true,
          screenshot: true,
          createdAt: true,
          strategyId: false,
        },
        orderBy: desc(backtestTrades.entryDate),
      },
    },
    orderBy: desc(backtestStrategies.createdAt),
    limit: 50,
  });

  return data;
}

export async function getPublicBacktestStrategyById(strategyId: string) {
  noStore();

  return db.query.backtestStrategies.findFirst({
    where: eq(backtestStrategies.id, strategyId),
    columns: {
      id: true,
      strategyName: true,
      market: true,
      timeframe: true,
      rrTarget: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      userId: false,
    },
    with: {
      backtestTrades: {
        columns: {
          id: true,
          tradeNumber: true,
          pair: true,
          entryDate: true,
          result: true,
          rrAchieved: true,
          screenshot: true,
          createdAt: true,
          strategyId: false,
        },
        orderBy: desc(backtestTrades.entryDate),
      },
    },
  });
}

