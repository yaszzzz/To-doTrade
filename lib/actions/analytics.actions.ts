"use server";

import { getCachedSession } from "@/lib/auth-cache";
import { db } from "@/lib/db";
import { trades } from "@/lib/db/schema";
import { eq, and, gte, lte, sql, count, sum, avg } from "drizzle-orm";

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
  const session = await getCachedSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

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

  const baseWhere = and(...conditions);

  // Run all aggregation queries in parallel
  const [perfByPair, plRows, distributionRows, freqRows] = await Promise.all([
    // Performance by pair — grouped in SQL
    db
      .select({
        pair: trades.pair,
        totalTrades: count(),
        wins: sql<number>`COUNT(*) FILTER (WHERE ${trades.result} = 'win')`,
        losses: sql<number>`COUNT(*) FILTER (WHERE ${trades.result} = 'loss')`,
        closed: sql<number>`COUNT(*) FILTER (WHERE ${trades.result} IS NOT NULL)`,
        totalPL: sql<number>`COALESCE(SUM(${trades.profitLoss}::numeric) FILTER (WHERE ${trades.result} IS NOT NULL), 0)`,
        avgRR: sql<number>`COALESCE(AVG(${trades.rrRatio}::numeric), 0)`,
      })
      .from(trades)
      .where(baseWhere)
      .groupBy(trades.pair),

    // P&L over time — only closed trades, ordered by date for cumulative calc
    db
      .select({
        date: sql<string>`${trades.tradeDate}::date::text`,
        tradePL: sql<number>`${trades.profitLoss}::numeric`,
      })
      .from(trades)
      .where(and(baseWhere, sql`${trades.result} IS NOT NULL`))
      .orderBy(trades.tradeDate),

    // Win/loss distribution — single aggregate row
    db
      .select({
        wins: sql<number>`COUNT(*) FILTER (WHERE ${trades.result} = 'win')`,
        losses: sql<number>`COUNT(*) FILTER (WHERE ${trades.result} = 'loss')`,
        breakeven: sql<number>`COUNT(*) FILTER (WHERE ${trades.result} = 'breakeven')`,
      })
      .from(trades)
      .where(baseWhere),

    // Trade frequency by month — grouped in SQL
    db
      .select({
        period: sql<string>`TO_CHAR(${trades.tradeDate}, 'YYYY-MM')`,
        count: count(),
      })
      .from(trades)
      .where(baseWhere)
      .groupBy(sql`TO_CHAR(${trades.tradeDate}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${trades.tradeDate}, 'YYYY-MM')`),
  ]);

  // Map pair performance
  const performanceByPair = perfByPair.map((row) => {
    const closed = Number(row.closed);
    const wins = Number(row.wins);
    return {
      pair: row.pair,
      totalTrades: Number(row.totalTrades),
      wins,
      losses: Number(row.losses),
      winRate: closed > 0 ? (wins / closed) * 100 : 0,
      totalPL: Number(row.totalPL),
      avgRR: Number(row.avgRR),
    };
  });

  // Build cumulative P&L (requires sequential processing — minimal JS)
  let cumulative = 0;
  const plOverTime = plRows.map((row) => {
    const tradePL = Number(row.tradePL ?? 0);
    cumulative += tradePL;
    return { date: row.date, cumulativePL: cumulative, tradePL };
  });

  // Win/loss distribution
  const dist = distributionRows[0] ?? { wins: 0, losses: 0, breakeven: 0 };
  const winLossDistribution = {
    wins: Number(dist.wins),
    losses: Number(dist.losses),
    breakeven: Number(dist.breakeven),
  };

  // Trade frequency
  const tradeFrequency = freqRows.map((row) => ({
    period: row.period,
    count: Number(row.count),
  }));

  return { performanceByPair, plOverTime, winLossDistribution, tradeFrequency };
}

// Get unique pairs for filter dropdown
export async function getUniquePairs() {
  const session = await getCachedSession();
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