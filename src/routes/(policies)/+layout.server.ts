import type { LayoutServerLoad } from './$types';


export const load: LayoutServerLoad = (async ({ parent, url }) => {
  const data = await parent()
  return { user: data.user, pathname: url.pathname };
});