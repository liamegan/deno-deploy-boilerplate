/**
 * Authentication utilities for the Recipe Manager
 * Provides password hashing, session management, and user authentication.
 */

import { prisma } from './db.ts';
import type { User, Session } from '@prisma/client';

// Session cookie name
export const SESSION_COOKIE = 'session';
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Hash a password using Web Crypto API (available in Deno)
 */
export async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);

	// Generate a random salt
	const salt = crypto.getRandomValues(new Uint8Array(16));

	// Import the password as a key
	const keyMaterial = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, ['deriveBits']);

	// Derive the hash
	const hashBuffer = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: 100000,
			hash: 'SHA-256'
		},
		keyMaterial,
		256
	);

	// Combine salt and hash for storage
	const hashArray = new Uint8Array(hashBuffer);
	const combined = new Uint8Array(salt.length + hashArray.length);
	combined.set(salt);
	combined.set(hashArray, salt.length);

	// Return as base64
	return btoa(String.fromCharCode(...combined));
}

/**
 * Verify a password against a stored hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
	try {
		const encoder = new TextEncoder();
		const data = encoder.encode(password);

		// Decode the stored hash
		const combined = Uint8Array.from(atob(storedHash), (c) => c.charCodeAt(0));

		// Extract salt (first 16 bytes)
		const salt = combined.slice(0, 16);
		const storedHashBytes = combined.slice(16);

		// Import the password as a key
		const keyMaterial = await crypto.subtle.importKey('raw', data, 'PBKDF2', false, ['deriveBits']);

		// Derive the hash with the same salt
		const hashBuffer = await crypto.subtle.deriveBits(
			{
				name: 'PBKDF2',
				salt: salt,
				iterations: 100000,
				hash: 'SHA-256'
			},
			keyMaterial,
			256
		);

		const hashArray = new Uint8Array(hashBuffer);

		// Compare hashes
		if (hashArray.length !== storedHashBytes.length) return false;
		return hashArray.every((byte, i) => byte === storedHashBytes[i]);
	} catch {
		return false;
	}
}

/**
 * Create a new user session
 */
export async function createSession(userId: string): Promise<Session> {
	const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

	return prisma.session.create({
		data: {
			userId,
			expiresAt
		}
	});
}

/**
 * Get session with user data
 */
export async function getSessionWithUser(
	sessionId: string
): Promise<{ session: Session; user: User } | null> {
	const session = await prisma.session.findUnique({
		where: { id: sessionId },
		include: { user: true }
	});

	if (!session) return null;

	// Check if session is expired
	if (session.expiresAt < new Date()) {
		await prisma.session.delete({ where: { id: sessionId } });
		return null;
	}

	return { session, user: session.user };
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(sessionId: string): Promise<void> {
	try {
		await prisma.session.delete({ where: { id: sessionId } });
	} catch {
		// Session may already be deleted
	}
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<void> {
	await prisma.session.deleteMany({
		where: {
			expiresAt: { lt: new Date() }
		}
	});
}

/**
 * Register a new user
 */
export async function registerUser(
	email: string,
	password: string,
	name?: string
): Promise<User | null> {
	// Check if user exists
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) return null;

	const passwordHash = await hashPassword(password);

	return prisma.user.create({
		data: {
			email,
			passwordHash,
			name
		}
	});
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) return null;

	const valid = await verifyPassword(password, user.passwordHash);
	if (!valid) return null;

	return user;
}

export type SafeUser = Omit<User, 'passwordHash'>;

/**
 * Get user without sensitive data
 */
export function toSafeUser(user: User): SafeUser {
	const { passwordHash: _, ...safeUser } = user;
	return safeUser;
}
