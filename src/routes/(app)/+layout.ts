import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  console.log('data in routes (app) +layout.ts', data)

  return {
    ...data
  };
};

