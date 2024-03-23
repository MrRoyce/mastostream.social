import type { LayoutServerLoad } from './$types';


export const load: LayoutServerLoad = (async ({ locals }) => {

  console.log('user in (app) +layout.server.ts', locals.user)

  return { user: locals.user };

});