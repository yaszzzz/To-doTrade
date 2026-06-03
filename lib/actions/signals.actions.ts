"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { signals } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type SignalStatus = "running" | "hit_tp" | "hit_sl" | "cancelled";
export type SignalResult = "win" | "loss" | "breakeven";

export async function getSignals(filters?: {
  status?: SignalStatus | "all";
  search?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .select()
    .from(signals)
    .where(eq(signals.userId, session.user.id))
    .orderBy(desc(signals.signalDate));

  let filteredResults = result;

  if (filters?.status && filters.status !== "all") {
    filteredResults = filteredResults.filter(
      (signal) => signal.status === filters.status
    );
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredResults = filteredResults.filter(
      (signal) =>
        signal.pair.toLowerCase().includes(searchLower) ||
        signal.analysis?.toLowerCase().includes(searchLower)
    );
  }

  return filteredResults;
}

export async function getSignalById(signalId: string) {
  const session = await auth();
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
  const session = await auth();
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
  const session = await auth();
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
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const allSignals = await db
    .select()
    .from(signals)
    .where(eq(signals.userId, session.user.id));

  const totalSignals = allSignals.length;
  const runningSignals = allSignals.filter((signal) => signal.status === "running").length;
  const hitTpSignals = allSignals.filter((signal) => signal.status === "hit_tp").length;
  const hitSlSignals = allSignals.filter((signal) => signal.status === "hit_sl").length;
  const cancelledSignals = allSignals.filter(
    (signal) => signal.status === "cancelled"
  ).length;

  const completedSignals = allSignals.filter(
    (signal) => signal.status === "hit_tp" || signal.status === "hit_sl"
  );
  const winRate =
    completedSignals.length > 0
      ? (hitTpSignals / completedSignals.length) * 100
      : 0;

  const totalProfitLoss = allSignals.reduce((sum, signal) => {
    return sum + (signal.profitLoss ? parseFloat(signal.profitLoss) : 0);
  }, 0);

  const averageRR =
    completedSignals.length > 0
      ? completedSignals.reduce((sum, signal) => {
          return sum + (signal.rrAchieved ? parseFloat(signal.rrAchieved) : 0);
        }, 0) / completedSignals.length
      : 0;

  return {
    totalSignals,
    runningSignals,
    hitTpSignals,
    hitSlSignals,
    cancelledSignals,
    winRate,
    totalProfitLoss,
    averageRR,
  };
}