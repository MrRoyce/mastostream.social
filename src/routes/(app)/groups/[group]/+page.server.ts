import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const maxParamLength = 25

export const load: PageServerLoad = (async ({ params, locals }) => {

  const user = locals.user

  if (!user) {
    redirect(307, '/')
  }

  if (!params.group || params.group.length > maxParamLength) {
    console.warn(`params.group.length > ${maxParamLength}`, params.group.length)
    throw redirect(307, '/')
  }

  return {
    user,
    group: params.group
  };
});