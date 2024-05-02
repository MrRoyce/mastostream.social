import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const maxParamLength = 25

export const load: PageServerLoad = (async ({ params }) => {

  if (!params.group || params.group.length > maxParamLength) {
    console.warn(`params.group.length > ${maxParamLength}`, params.group.length)
    throw redirect(307, '/')
  }

  return {
    group: params.group
  };
});