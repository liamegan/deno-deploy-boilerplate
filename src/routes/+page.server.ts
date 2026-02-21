import type { PageServerLoad } from './$types';
// import { prisma } from '$lib/server/db.ts';

export const load: PageServerLoad = async ({ locals }) => {
	// If user is logged in, fetch their data
	if (locals.user) {
		try {
			return {
				user: locals.user
			};
		} catch (error) {
			// console.error('Database error loading home page:', error);
			return {
				user: locals.user
			};
		}
	}

	// Not logged in - return empty data for landing page
	return {
		user: null,
		recipes: [],
		ingredients: []
	};
};
