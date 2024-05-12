import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDocument } from '$lib/getCollection';

const maxParamLength = 50

export const load: PageServerLoad = (async ({ params, locals }) => {

  const user = locals.user

  if (!user) {
    redirect(307, '/')
  }

  if (!params.group || params.group.length > maxParamLength) {
    console.warn(`params.group.length > ${maxParamLength}`, params.group.length)
    throw redirect(307, '/')
  }

  const userDocument = (user.uid) ? await getDocument({ entity: 'users', id: user.uid }) : {}

  return {
    acct: userDocument?.acct || '',
    user,
    group: params.group
  };
});