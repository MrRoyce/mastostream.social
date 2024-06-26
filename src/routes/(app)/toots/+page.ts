import type { PageLoad } from './$types';

export const ssr = false;
export const prerender = false;

export const load: PageLoad = (async ({ url, data }) => {
  const tootType = url.searchParams.get('type') ?? 'both'
  return {
    tootTypePassed: tootType,
    ...data
  };
});