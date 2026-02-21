import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	registerUser,
	createSession,
	SESSION_COOKIE,
	SESSION_DURATION_MS
} from '$lib/server/auth.ts';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect if already logged in
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString() || undefined;
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();
		const confirmPassword = data.get('confirmPassword')?.toString();

		if (!email || !password || !confirmPassword) {
			return fail(400, { error: 'All fields are required' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: "Passwords don't match" });
		}

		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters' });
		}

		const user = await registerUser(email, password, name);

		if (!user) {
			return fail(400, { error: 'An account with this email already exists' });
		}

		// Create session
		const session = await createSession(user.id);

		// Set session cookie
		cookies.set(SESSION_COOKIE, session.id, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: SESSION_DURATION_MS / 1000
		});

		throw redirect(302, '/');
	}
};
