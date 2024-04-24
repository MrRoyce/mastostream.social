import type { PageLoad } from './$types';

export const load: PageLoad = (async ({ url, data }) => {
  const tootType = url.searchParams.get('type') ?? 'both'
  return {
    tootTypePassed: tootType,
    ...data
  };
});