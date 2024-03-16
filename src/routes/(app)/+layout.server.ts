import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';


export const load: LayoutServerLoad = (async ({ locals }) => {

  const { uid, admin } = locals?.user || { uid: false, admin: false }

  return { user: locals.user };

});