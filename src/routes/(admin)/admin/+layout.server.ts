import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';


export const load: LayoutServerLoad = (async ({ locals }) => {

  const { uid, admin } = locals?.user || { uid: null, admin: null }

  if (!uid || !admin) {
    throw redirect(307, '/')
  }

  return { user: locals.user };

});