import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";
import ws from "ws";

// Configure Neon for WebSocket support
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

// Create a new pool for Neon
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create the Drizzle instance
export const db = drizzle(pool, { schema });

// Export types
export * from "./schema";