import type { Handle } from '@sveltejs/kit';
import { getSessionWithUser, toSafeUser, SESSION_COOKIE } from '$lib/server/auth.ts';

export const handle: Handle = async ({ event, resolve }) => {
	// Get session ID from cookie
	const sessionId = event.cookies.get(SESSION_COOKIE);

	if (sessionId) {
		try {
			const result = await getSessionWithUser(sessionId);
			if (result) {
				event.locals.user = toSafeUser(result.user);
				event.locals.sessionId = sessionId;
			} else {
				// Invalid or expired session, clear the cookie
				event.cookies.delete(SESSION_COOKIE, { path: '/' });
				event.locals.user = null;
				event.locals.sessionId = null;
			}
		} catch (error) {
			console.error('Session lookup error:', error);
			event.locals.user = null;
			event.locals.sessionId = null;
		}
	} else {
		event.locals.user = null;
		event.locals.sessionId = null;
	}

	return resolve(event);
};
