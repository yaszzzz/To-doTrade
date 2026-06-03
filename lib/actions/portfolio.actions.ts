"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { portfolioAssets } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type AssetType = "crypto" | "saham" | "cash";

export async function getPortfolioAssets() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return db
    .select()
    .from(portfolioAssets)
    .where(eq(portfolioAssets.userId, session.user.id))
    .orderBy(desc(portfolioAssets.createdAt));
}

export async function getPortfolioAssetById(assetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const asset = await db.query.portfolioAssets.findFirst({
    where: and(
      eq(portfolioAssets.id, assetId),
      eq(portfolioAssets.userId, session.user.id)
    ),
  });

  if (!asset) {
    throw new Error("Portfolio asset not found");
  }

  return asset;
}

export async function createPortfolioAsset(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const assetType = formData.get("assetType") as AssetType;
    const assetName = formData.get("assetName") as string;
    const quantity = formData.get("quantity") as string;
    const averagePrice = formData.get("averagePrice") as string;
    const currentPrice = formData.get("currentPrice") as string;

    if (!assetType || !assetName || !quantity || !averagePrice) {
      return { error: "Asset type, name, quantity, and average price are required" };
    }

    const [asset] = await db
      .insert(portfolioAssets)
      .values({
        userId: session.user.id,
        assetType,
        assetName: assetName.toUpperCase(),
        quantity,
        averagePrice,
        currentPrice: currentPrice || null,
      })
      .returning();

    revalidatePath("/portfolio");
    revalidatePath("/dashboard");

    return { success: true, assetId: asset.id };
  } catch (error) {
    console.error("Create portfolio asset error:", error);
    return { error: "Failed to create portfolio asset" };
  }
}

export async function updatePortfolioAsset(assetId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const existingAsset = await db.query.portfolioAssets.findFirst({
      where: and(
        eq(portfolioAssets.id, assetId),
        eq(portfolioAssets.userId, session.user.id)
      ),
    });

    if (!existingAsset) {
      return { error: "Portfolio asset not found" };
    }

    const assetType = formData.get("assetType") as AssetType;
    const assetName = formData.get("assetName") as string;
    const quantity = formData.get("quantity") as string;
    const averagePrice = formData.get("averagePrice") as string;
    const currentPrice = formData.get("currentPrice") as string;

    await db
      .update(portfolioAssets)
      .set({
        assetType,
        assetName: assetName.toUpperCase(),
        quantity,
        averagePrice,
        currentPrice: currentPrice || null,
        updatedAt: new Date(),
      })
      .where(
        and(eq(portfolioAssets.id, assetId), eq(portfolioAssets.userId, session.user.id))
      );

    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${assetId}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Update portfolio asset error:", error);
    return { error: "Failed to update portfolio asset" };
  }
}

export async function deletePortfolioAsset(assetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db
      .delete(portfolioAssets)
      .where(
        and(eq(portfolioAssets.id, assetId), eq(portfolioAssets.userId, session.user.id))
      );

    revalidatePath("/portfolio");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Delete portfolio asset error:", error);
    return { error: "Failed to delete portfolio asset" };
  }
}
