"use server";

import { getCachedSession } from "@/lib/auth-cache";
import { db } from "@/lib/db";
import { signals } from "@/lib/db/schema";
import { and, desc, eq, ilike, or, sql, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type SignalStatus = "running" | "hit_tp" | "hit_sl" | "cancelled";
export type SignalResult = "win" | "loss" | "breakeven";

export async function getSignals(filters?: {
  status?: SignalStatus | "all";
  search?: string;
}) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Fix: use SQL WHERE instead of fetching all rows and filtering in JS
  const conditions = [eq(signals.userId, session.user.id)];

  if (filters?.status && filters.status !== "all") {
    conditions.push(eq(signals.status, filters.status));
  }

  if (filters?.search) {
    conditions.push(
      or(
        ilike(signals.pair, `%${filters.search}%`),
        ilike(signals.analysis, `%${filters.search}%`)
      )!
    );
  }

  return db
    .select()
    .from(signals)
    .where(and(...conditions))
    .orderBy(desc(signals.signalDate));
}

export async function getSignalById(signalId: string) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const signal = await db.query.signals.findFirst({
    where: and(eq(signals.id, signalId), eq(signals.userId, session.user.id)),
  });

  if (!signal) {
    throw new Error("Signal not found");
  }

  return signal;
}

export async function createSignal(formData: FormData) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const pair = formData.get("pair") as string;
    const entry = formData.get("entry") as string;
    const stopLoss = formData.get("stopLoss") as string;
    const takeProfit = formData.get("takeProfit") as string;
    const analysis = formData.get("analysis") as string;
    const chartScreenshot = formData.get("chartScreenshot") as string;

    if (!pair || !entry || !stopLoss || !takeProfit) {
      return { error: "Pair, entry, stop loss, and take profit are required" };
    }

    const entryPrice = parseFloat(entry);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    const risk = Math.abs(entryPrice - sl);
    const reward = Math.abs(tp - entryPrice);
    const riskReward = risk > 0 ? (reward / risk).toFixed(2) : "0";

    const [newSignal] = await db
      .insert(signals)
      .values({
        userId: session.user.id,
        pair: pair.toUpperCase(),
        entry,
        stopLoss,
        takeProfit,
        riskReward,
        signalDate: new Date(),
        analysis: analysis || null,
        chartScreenshot: chartScreenshot || null,
      })
      .returning();

    revalidatePath("/signals");
    revalidatePath("/dashboard");

    return { success: true, signalId: newSignal.id };
  } catch (error) {
    console.error("Create signal error:", error);
    return { error: "Failed to create signal" };
  }
}

export async function updateSignalStatus(signalId: string, formData: FormData) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const existingSignal = await db.query.signals.findFirst({
      where: and(eq(signals.id, signalId), eq(signals.userId, session.user.id)),
    });

    if (!existingSignal) {
      return { error: "Signal not found" };
    }

    const status = formData.get("status") as SignalStatus;
    const result = formData.get("result") as SignalResult | "";
    const profitLoss = formData.get("profitLoss") as string;
    const rrAchieved = formData.get("rrAchieved") as string;
    const resultScreenshot = formData.get("resultScreenshot") as string;

    await db
      .update(signals)
      .set({
        status,
        result: result || null,
        profitLoss: profitLoss || null,
        rrAchieved: rrAchieved || null,
        resultScreenshot: resultScreenshot || null,
        updatedAt: new Date(),
      })
      .where(and(eq(signals.id, signalId), eq(signals.userId, session.user.id)));

    revalidatePath("/signals");
    revalidatePath(`/signals/${signalId}`);
    revalidatePath("/dashboard");
    revalidatePath("/analytics");

    return { success: true };
  } catch (error) {
    console.error("Update signal status error:", error);
    return { error: "Failed to update signal" };
  }
}

export async function getSignalStats() {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Fix: use SQL aggregations instead of fetching all rows to JS
  const [stats] = await db
    .select({
      totalSignals: count(),
      runningSignals: sql<number>`COUNT(*) FILTER (WHERE ${signals.status} = 'running')`,
      hitTpSignals: sql<number>`COUNT(*) FILTER (WHERE ${signals.status} = 'hit_tp')`,
      hitSlSignals: sql<number>`COUNT(*) FILTER (WHERE ${signals.status} = 'hit_sl')`,
      cancelledSignals: sql<number>`COUNT(*) FILTER (WHERE ${signals.status} = 'cancelled')`,
      completedSignals: sql<number>`COUNT(*) FILTER (WHERE ${signals.status} IN ('hit_tp', 'hit_sl'))`,
      totalProfitLoss: sql<number>`COALESCE(SUM(${signals.profitLoss}::numeric), 0)`,
      averageRR: sql<number>`COALESCE(AVG(CASE WHEN ${signals.status} IN ('hit_tp', 'hit_sl') THEN ${signals.rrAchieved}::numeric END), 0)`,
    })
    .from(signals)
    .where(eq(signals.userId, session.user.id));

  const hitTp = Number(stats.hitTpSignals);
  const completed = Number(stats.completedSignals);
  const winRate = completed > 0 ? (hitTp / completed) * 100 : 0;

  return {
    totalSignals: Number(stats.totalSignals),
    runningSignals: Number(stats.runningSignals),
    hitTpSignals: hitTp,
    hitSlSignals: Number(stats.hitSlSignals),
    cancelledSignals: Number(stats.cancelledSignals),
    winRate,
    totalProfitLoss: Number(stats.totalProfitLoss),
    averageRR: Number(stats.averageRR),
  };
}