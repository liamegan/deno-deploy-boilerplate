import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { config } from 'https://deno.land/x/dotenv/mod.ts';

// Deno Deploy tunnel provides DATABASE_URL automatically
// const connectionString = Deno.env.get('DATABASE_URL');
const connectionString = Deno.env.get('DATABASE_URL')! || config().DATABASE_URL;

if (!connectionString) {
	console.warn(
		"⚠️  Yo! DATABASE_URL not found. Make sure you're running with --tunnel flag:\n" +
			'   deno run --tunnel -A npm:prisma db push'
	);
}

export default defineConfig({
	earlyAccess: true,
	schema: path.join(import.meta.dirname ?? '.', 'prisma/schema.prisma'),

	// Required for db push
	datasource: {
		url: connectionString ?? ''
	},

	migrations: {
		path: 'prisma/migrations',
		seed: 'tsx db/seed.ts'
	}
});
