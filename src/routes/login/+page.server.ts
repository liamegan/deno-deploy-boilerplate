import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	authenticateUser,
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
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		const user = await authenticateUser(email, password);

		if (!user) {
			return fail(401, { error: 'Invalid email or password' });
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
