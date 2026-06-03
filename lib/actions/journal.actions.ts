"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { trades, tags, tradeTags } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Get all trades for current user with filters
export async function getTrades(filters?: {
  result?: "win" | "loss" | "breakeven" | "all";
  search?: string;
}) {
  const session = await auth();
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
    .where(eq(trades.userId, session.user.id))
    .groupBy(trades.id)
    .orderBy(desc(trades.tradeDate));

  // Apply filters
  let filteredResults = result;

  if (filters?.result && filters.result !== "all") {
    filteredResults = filteredResults.filter(
      (r) => r.trade.result === filters.result
    );
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredResults = filteredResults.filter(
      (r) =>
        r.trade.pair.toLowerCase().includes(searchLower) ||
        r.trade.tradingReason?.toLowerCase().includes(searchLower) ||
        r.trade.evaluationNotes?.toLowerCase().includes(searchLower)
    );
  }

  return filteredResults;
}

// Get single trade by ID
export async function getTradeById(tradeId: string) {
  const session = await auth();
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
    throw new Error("Trade not found");
  }

  return result[0];
}

// Create new trade
export async function createTrade(formData: FormData) {
  const session = await auth();
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
    const selectedTags = formData.get("tags") as string; // JSON string of tag IDs

    // Calculate RR ratio
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    const rrRatio = risk > 0 ? (reward / risk).toFixed(2) : "0";

    // Insert trade
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

    // Insert trade tags if any
    if (selectedTags) {
      const tagIds = JSON.parse(selectedTags) as string[];
      if (tagIds.length > 0) {
        await db.insert(tradeTags).values(
          tagIds.map((tagId) => ({
            tradeId: newTrade.id,
            tagId,
          }))
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
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    // Verify ownership
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

    // Recalculate RR ratio
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    const rrRatio = risk > 0 ? (reward / risk).toFixed(2) : "0";

    // Update trade
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

    // Update tags
    if (selectedTags) {
      // Delete existing trade tags
      await db.delete(tradeTags).where(eq(tradeTags.tradeId, tradeId));

      // Insert new tags
      const tagIds = JSON.parse(selectedTags) as string[];
      if (tagIds.length > 0) {
        await db.insert(tradeTags).values(
          tagIds.map((tagId) => ({
            tradeId,
            tagId,
          }))
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
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    // Get trade
    const trade = await db.query.trades.findFirst({
      where: and(eq(trades.id, tradeId), eq(trades.userId, session.user.id)),
    });

    if (!trade) {
      return { error: "Trade not found" };
    }

    if (trade.result) {
      return { error: "Trade already closed" };
    }

    // Update trade
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
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    // Verify ownership
    const trade = await db.query.trades.findFirst({
      where: and(eq(trades.id, tradeId), eq(trades.userId, session.user.id)),
    });

    if (!trade) {
      return { error: "Trade not found" };
    }

    // Delete trade tags first (foreign key constraint)
    await db.delete(tradeTags).where(eq(tradeTags.tradeId, tradeId));

    // Delete trade
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

// Get trade statistics for current user
export async function getTradeStats() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userTrades = await db
    .select()
    .from(trades)
    .where(eq(trades.userId, session.user.id));

  const totalTrades = userTrades.length;
  const closedTrades = userTrades.filter((t) => t.result !== null);
  const openTrades = userTrades.filter((t) => t.result === null);

  const winningTrades = closedTrades.filter((t) => t.result === "win");
  const losingTrades = closedTrades.filter((t) => t.result === "loss");

  const winRate =
    closedTrades.length > 0
      ? (winningTrades.length / closedTrades.length) * 100
      : 0;

  const totalProfit = closedTrades.reduce(
    (sum, t) => sum + (t.profitLoss ? parseFloat(t.profitLoss) : 0),
    0
  );

  const avgRR =
    userTrades.length > 0
      ? userTrades.reduce((sum, t) => sum + parseFloat(t.rrRatio), 0) / userTrades.length
      : 0;

  return {
    totalTrades,
    closedTrades: closedTrades.length,
    openTrades: openTrades.length,
    winRate,
    totalProfit,
    avgRR,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
  };
}