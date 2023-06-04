/* This file was created by inlang.
It is needed in order to circumvent a current limitation of SvelteKit. See https://github.com/inlang/inlang/issues/647
You can remove this comment and modify the file as you like. We just need to make sure it exists.
Please do not delete it (inlang will recreate it if needed). */

import { redirect } from '@sveltejs/kit';

// see: ~11:30 https://www.youtube.com/watch?v=mt56gKUeppk&list=PLm_Qt4aKpfKjf77S8UD79Ockhwp_699Ms&index=20

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	const access = event.cookies.get('access') === 'true';

	if (!access && event.route.id?.startsWith('/(app)')) {
		throw redirect(302, '/login');
	}

	const theme = event.cookies.get('siteTheme');

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
	});
	return response;
};