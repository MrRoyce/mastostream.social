import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDocument } from '$lib/getCollection';

export const load: PageServerLoad = (async ({ locals }) => {
  const user = locals.user

  if (!user) {
    redirect(307, '/')
  }

  let entity

  try {
    entity = await getDocument({ entity: 'users', id: user.uid })
    if (entity) {
      entity.messages = entity.messages ? entity.messages : []
    }
  } catch (error) {
    console.error(`Error getting users messages for uid: ${user.uid}`, error)
  }

  return {
    entity: JSON.parse(JSON.stringify(entity)),
    user
  };
});

export const actions = {
  add: async ({ request, locals }) => {
    const user = locals.user
    const formData = (await request.formData())
    const data = Object.fromEntries(formData.entries())
  }
}