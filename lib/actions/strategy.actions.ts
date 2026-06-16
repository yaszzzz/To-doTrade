"use server";

import { getCachedSession } from "@/lib/auth-cache";
import { db } from "@/lib/db";
import { strategies } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getStrategies() {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return db
    .select()
    .from(strategies)
    .where(eq(strategies.userId, session.user.id))
    .orderBy(desc(strategies.createdAt));
}

export async function getStrategyById(strategyId: string) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const strategy = await db.query.strategies.findFirst({
    where: and(eq(strategies.id, strategyId), eq(strategies.userId, session.user.id)),
  });

  if (!strategy) {
    throw new Error("Strategy not found");
  }

  return strategy;
}

export async function createStrategy(formData: FormData) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const strategyName = formData.get("strategyName") as string;
    const rules = formData.get("rules") as string;
    const entryCriteria = formData.get("entryCriteria") as string;
    const exitCriteria = formData.get("exitCriteria") as string;
    const riskManagement = formData.get("riskManagement") as string;

    if (!strategyName) {
      return { error: "Strategy name is required" };
    }

    const [strategy] = await db
      .insert(strategies)
      .values({
        userId: session.user.id,
        strategyName,
        rules: rules || null,
        entryCriteria: entryCriteria || null,
        exitCriteria: exitCriteria || null,
        riskManagement: riskManagement || null,
      })
      .returning();

    revalidatePath("/strategy-vault");

    return { success: true, strategyId: strategy.id };
  } catch (error) {
    console.error("Create strategy error:", error);
    return { error: "Failed to create strategy" };
  }
}

export async function updateStrategy(strategyId: string, formData: FormData) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const existingStrategy = await db.query.strategies.findFirst({
      where: and(eq(strategies.id, strategyId), eq(strategies.userId, session.user.id)),
    });

    if (!existingStrategy) {
      return { error: "Strategy not found" };
    }

    const strategyName = formData.get("strategyName") as string;
    const rules = formData.get("rules") as string;
    const entryCriteria = formData.get("entryCriteria") as string;
    const exitCriteria = formData.get("exitCriteria") as string;
    const riskManagement = formData.get("riskManagement") as string;

    if (!strategyName) {
      return { error: "Strategy name is required" };
    }

    await db
      .update(strategies)
      .set({
        strategyName,
        rules: rules || null,
        entryCriteria: entryCriteria || null,
        exitCriteria: exitCriteria || null,
        riskManagement: riskManagement || null,
        updatedAt: new Date(),
      })
      .where(and(eq(strategies.id, strategyId), eq(strategies.userId, session.user.id)));

    revalidatePath("/strategy-vault");
    revalidatePath(`/strategy-vault/${strategyId}`);

    return { success: true };
  } catch (error) {
    console.error("Update strategy error:", error);
    return { error: "Failed to update strategy" };
  }
}

export async function deleteStrategy(strategyId: string) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db
      .delete(strategies)
      .where(and(eq(strategies.id, strategyId), eq(strategies.userId, session.user.id)));

    revalidatePath("/strategy-vault");

    return { success: true };
  } catch (error) {
    console.error("Delete strategy error:", error);
    return { error: "Failed to delete strategy" };
  }
}