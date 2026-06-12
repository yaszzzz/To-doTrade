import { cache } from "react";
import { auth } from "@/lib/auth";

/**
 * Cached auth() — deduplicates session lookups within a single request.
 * When layout.tsx and a page both call this, only one JWT decode happens.
 */
export const getCachedSession = cache(auth);