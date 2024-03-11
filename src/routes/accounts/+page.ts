import type { PageLoad } from './$types';

export const ssr = false;
export const prerender = false;

export const load = (async ({ url }) => {
  const tootType = url.searchParams.get('type') ?? 'human'
  console.log('tootType', tootType)
  return { tootTypePassed: tootType };
}) satisfies PageLoad;