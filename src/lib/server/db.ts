/**
 * Database connection using Prisma Client with PostgreSQL adapter
 * This module provides a singleton Prisma client instance for the application.
 * The client is lazily initialized to avoid creating connections during build.
 */

import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

// Create a singleton Prisma client (lazily initialized)
const globalForPrisma = globalThis as unknown as {
	prisma: InstanceType<typeof PrismaClient> | undefined;
};

function createPrismaClient(): InstanceType<typeof PrismaClient> {
	const connectionString = Deno.env.get('DATABASE_URL');

	console.log('Initializing Prisma client...');
	console.log('DATABASE_URL present:', !!connectionString);

	if (!connectionString) {
		throw new Error('DATABASE_URL environment variable is required');
	}

	const pool = new Pool({ connectionString });
	const adapter = new PrismaPg(pool);

	console.log('Prisma client created successfully');

	return new PrismaClient({
		adapter,
		log: ['error']
	});
}

// Lazy getter for prisma client - only creates connection when accessed at runtime
function getPrismaClient(): InstanceType<typeof PrismaClient> {
	if (!globalForPrisma.prisma) {
		globalForPrisma.prisma = createPrismaClient();
	}
	return globalForPrisma.prisma;
}

// Export a proxy that lazily initializes the client on first access
export const prisma = new Proxy({} as InstanceType<typeof PrismaClient>, {
	get(_target, prop) {
		return Reflect.get(getPrismaClient(), prop);
	}
});

export default prisma;
