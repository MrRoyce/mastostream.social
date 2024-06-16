import type { PageLoad } from './$types';

export const ssr = true;

export const load: PageLoad = (async ({ data }) => {
  // Note - not sure if this is doing anything.. probably not
  return {
    ...data
  };
});