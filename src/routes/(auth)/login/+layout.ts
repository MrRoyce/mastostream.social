import type { LayoutLoad } from './$types';

//export const ssr = false;  // Do not create this page on the server

export const load = (async ({ data }) => {
  return { ...data };
}) satisfies LayoutLoad;