"use server";

import { getCachedSession } from "@/lib/auth-cache";
import { db } from "@/lib/db";
import { trades, tags, tradeTags } from "@/lib/db/schema";
import { eq, and, desc, sql, count, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Get all trades for current user with filters (SQL-level filtering)
export async function getTrades(filters?: {
  result?: "win" | "loss" | "breakeven" | "all";
  search?: string;
}) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const conditions = [eq(trades.userId, session.user.id)];

  // Fix: push result filter into SQL WHERE instead of filtering in JS
  if (filters?.result && filters.result !== "all") {
    conditions.push(eq(trades.result, filters.result));
  }

  // Fix: push search filter into SQL ILIKE instead of filtering in JS
  if (filters?.search) {
    const term = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(trades.pair, term),
        ilike(trades.tradingReason, term),
        ilike(trades.evaluationNotes, term)
      )!
    );
  }

  return db
    .select({
      trade: trades,
      tags: sql<string[]>`COALESCE(
        array_agg(DISTINCT ${tags.name}) FILTER (WHERE ${tags.name} IS NOT NULL),
        ARRAY[]::text[]
      )`,
    })
    .from(trades)
    .leftJoin(tradeTags, eq(trades.id, tradeTags.tradeId))
    .leftJoin(tags, eq(tradeTags.tagId, tags.id))
    .where(and(...conditions))
    .groupBy(trades.id)
    .orderBy(desc(trades.tradeDate));
}

// Get single trade by ID
export async function getTradeById(tradeId: string) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .select({
      trade: trades,
      tags: sql<string[]>`COALESCE(
        array_agg(DISTINCT ${tags.name}) FILTER (WHERE ${tags.name} IS NOT NULL),
        ARRAY[]::text[]
      )`,
    })
    .from(trades)
    .leftJoin(tradeTags, eq(trades.id, tradeTags.tradeId))
    .leftJoin(tags, eq(tradeTags.tagId, tags.id))
    .where(and(eq(trades.id, tradeId), eq(trades.userId, session.user.id)))
    .groupBy(trades.id);

  if (result.length === 0) {
    return null;
  }

  return result[0];
}

// Get trade statistics — uses SQL aggregations instead of fetching all rows
export async function getTradeStats() {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [stats] = await db
    .select({
      totalTrades: count(),
      openTrades: sql<number>`COUNT(*) FILTER (WHERE ${trades.result} IS NULL)`,
      closedTrades: sql<number>`COUNT(*) FILTER (WHERE ${trades.result} IS NOT NULL)`,
      winningTrades: sql<number>`COUNT(*) FILTER (WHERE ${trades.result} = 'win')`,
      losingTrades: sql<number>`COUNT(*) FILTER (WHERE ${trades.result} = 'loss')`,
      totalProfit: sql<number>`COALESCE(SUM(CASE WHEN ${trades.result} IS NOT NULL THEN ${trades.profitLoss}::numeric ELSE 0 END), 0)`,
      avgRR: sql<number>`COALESCE(AVG(${trades.rrRatio}::numeric), 0)`,
    })
    .from(trades)
    .where(eq(trades.userId, session.user.id));

  const closed = Number(stats.closedTrades);
  const winning = Number(stats.winningTrades);
  const winRate = closed > 0 ? (winning / closed) * 100 : 0;

  return {
    totalTrades: Number(stats.totalTrades),
    openTrades: Number(stats.openTrades),
    closedTrades: closed,
    winningTrades: winning,
    losingTrades: Number(stats.losingTrades),
    winRate,
    totalProfit: Number(stats.totalProfit),
    avgRR: Number(stats.avgRR),
  };
}

// Create new trade
export async function createTrade(formData: FormData) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const marketType = formData.get("marketType") as "crypto_futures" | "crypto_spot" | "saham";
    const pair = formData.get("pair") as string;
    const positionType = formData.get("positionType") as "long" | "short";
    const entryPrice = formData.get("entryPrice") as string;
    const stopLoss = formData.get("stopLoss") as string;
    const takeProfit = formData.get("takeProfit") as string;
    const riskPercentage = formData.get("riskPercentage") as string;
    const positionSize = formData.get("positionSize") as string;
    const screenshotEntry = formData.get("screenshotEntry") as string;
    const tradingReason = formData.get("tradingReason") as string;
    const psychologyNotes = formData.get("psychologyNotes") as string;
    const selectedTags = formData.get("tags") as string;

    // Calculate RR ratio
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    const rrRatio = risk > 0 ? (reward / risk).toFixed(2) : "0";

    const [newTrade] = await db
      .insert(trades)
      .values({
        userId: session.user.id,
        marketType,
        pair,
        positionType,
        entryPrice,
        stopLoss,
        takeProfit,
        riskPercentage,
        positionSize,
        rrRatio,
        tradeDate: new Date(),
        screenshotEntry: screenshotEntry || null,
        tradingReason: tradingReason || null,
        psychologyNotes: psychologyNotes || null,
      })
      .returning();

    if (selectedTags) {
      const tagIds = JSON.parse(selectedTags) as string[];
      if (tagIds.length > 0) {
        await db.insert(tradeTags).values(
          tagIds.map((tagId) => ({ tradeId: newTrade.id, tagId }))
        );
      }
    }

    revalidatePath("/journal");
    revalidatePath("/dashboard");

    return { success: true, tradeId: newTrade.id };
  } catch (error) {
    console.error("Create trade error:", error);
    return { error: "Failed to create trade" };
  }
}

// Update existing trade
export async function updateTrade(tradeId: string, formData: FormData) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const existingTrade = await db.query.trades.findFirst({
      where: and(eq(trades.id, tradeId), eq(trades.userId, session.user.id)),
    });

    if (!existingTrade) {
      return { error: "Trade not found" };
    }

    const marketType = formData.get("marketType") as "crypto_futures" | "crypto_spot" | "saham";
    const pair = formData.get("pair") as string;
    const positionType = formData.get("positionType") as "long" | "short";
    const entryPrice = formData.get("entryPrice") as string;
    const stopLoss = formData.get("stopLoss") as string;
    const takeProfit = formData.get("takeProfit") as string;
    const riskPercentage = formData.get("riskPercentage") as string;
    const positionSize = formData.get("positionSize") as string;
    const screenshotEntry = formData.get("screenshotEntry") as string;
    const tradingReason = formData.get("tradingReason") as string;
    const psychologyNotes = formData.get("psychologyNotes") as string;
    const selectedTags = formData.get("tags") as string;

    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    const rrRatio = risk > 0 ? (reward / risk).toFixed(2) : "0";

    await db
      .update(trades)
      .set({
        marketType,
        pair,
        positionType,
        entryPrice,
        stopLoss,
        takeProfit,
        riskPercentage,
        positionSize,
        rrRatio,
        screenshotEntry: screenshotEntry || null,
        tradingReason: tradingReason || null,
        psychologyNotes: psychologyNotes || null,
        updatedAt: new Date(),
      })
      .where(eq(trades.id, tradeId));

    if (selectedTags) {
      await db.delete(tradeTags).where(eq(tradeTags.tradeId, tradeId));
      const tagIds = JSON.parse(selectedTags) as string[];
      if (tagIds.length > 0) {
        await db.insert(tradeTags).values(
          tagIds.map((tagId) => ({ tradeId, tagId }))
        );
      }
    }

    revalidatePath("/journal");
    revalidatePath(`/journal/${tradeId}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Update trade error:", error);
    return { error: "Failed to update trade" };
  }
}

// Close trade with result and profit/loss
export async function closeTrade(
  tradeId: string,
  result: "win" | "loss" | "breakeven",
  profitLoss: string,
  screenshotExit?: string,
  evaluationNotes?: string
) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const trade = await db.query.trades.findFirst({
      where: and(eq(trades.id, tradeId), eq(trades.userId, session.user.id)),
    });

    if (!trade) {
      return { error: "Trade not found" };
    }

    if (trade.result) {
      return { error: "Trade already closed" };
    }

    await db
      .update(trades)
      .set({
        result,
        profitLoss,
        screenshotExit: screenshotExit || null,
        evaluationNotes: evaluationNotes || null,
        updatedAt: new Date(),
      })
      .where(eq(trades.id, tradeId));

    revalidatePath("/journal");
    revalidatePath(`/journal/${tradeId}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Close trade error:", error);
    return { error: "Failed to close trade" };
  }
}

// Delete trade
export async function deleteTrade(tradeId: string) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const trade = await db.query.trades.findFirst({
      where: and(eq(trades.id, tradeId), eq(trades.userId, session.user.id)),
    });

    if (!trade) {
      return { error: "Trade not found" };
    }

    await db.delete(tradeTags).where(eq(tradeTags.tradeId, tradeId));
    await db.delete(trades).where(eq(trades.id, tradeId));

    revalidatePath("/journal");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Delete trade error:", error);
    return { error: "Failed to delete trade" };
  }
}

// Get all available tags
export async function getAllTags() {
  const allTags = await db.select().from(tags).orderBy(tags.name);
  return allTags;
}

// Create new tag
export async function createTag(name: string) {
  try {
    const [newTag] = await db
      .insert(tags)
      .values({ name })
      .returning();

    revalidatePath("/journal");
    return { success: true, tag: newTag };
  } catch (error) {
    console.error("Create tag error:", error);
    return { error: "Failed to create tag" };
  }
}