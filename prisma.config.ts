import path from "node:path";
import { defineConfig } from "prisma/config";

// Deno Deploy tunnel provides DATABASE_URL automatically
const connectionString = Deno.env.get("DATABASE_URL");

if (!connectionString) {
  console.warn(
    "⚠️  DATABASE_URL not found. Make sure you're running with --tunnel flag:\n" +
      "   deno run --tunnel -A npm:prisma db push",
  );
}

export default defineConfig({
  earlyAccess: true,
  schema: path.join(import.meta.dirname ?? ".", "prisma/schema.prisma"),

  // Required for db push
  datasource: {
    url: connectionString ?? "",
  },

  migrations: {
    path: "prisma/migrations",
    seed: "tsx db/seed.ts",
  },

  // migrate: {
  // 	async adapter() {
  // 		const { PrismaPg } = await import('@prisma/adapter-pg');
  // 		const { Pool } = await import('pg');

  // 		if (!connectionString) {
  // 			throw new Error('DATABASE_URL environment variable is not set');
  // 		}

  // 		console.log('🔗 Connecting to database...');
  // 		const pool = new Pool({
  // 			connectionString,
  // 			// Allow process to exit when pool is idle
  // 			allowExitOnIdle: true
  // 		});
  // 		return new PrismaPg(pool);
  // 	}
  // }
});
