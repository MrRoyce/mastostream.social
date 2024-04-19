import { getGroups } from '$lib/getCollection';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ locals }) => {
  const user = locals.user

  if (!user) {
    redirect(307, '/')
  }

  let groups

  try {
    groups = await getGroups({ entity: 'users', id: user.uid })
  } catch (error) {
    console.error(`Error getting users groups for uid: ${user.uid}`, error)
  }

  return {
    groups: JSON.parse(JSON.stringify(groups)),
    user
  };
});