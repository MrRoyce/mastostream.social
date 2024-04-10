import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit'

export const load: LayoutServerLoad = (async ({ locals }) => {

  if (!locals.user) {
    throw redirect(307, '/')
  }

  return {
    user: locals.user
  };
})