import type { PageServerLoad } from './$types';
import admin from 'firebase-admin';
import { fail, redirect } from '@sveltejs/kit';
import { getDocument } from '$lib/getCollection';


export const load: PageServerLoad = (async ({ locals }) => {

  const user = locals.user

  if (!user) {
    redirect(307, '/')
  }

  let entity

  try {
    entity = await getDocument({ entity: 'users', id: user.uid })
  } catch (error) {
    console.error(`Error getting users document for uid: ${user.uid}`, error)
  }

  return {
    entity,
    user
  };
})

export const actions = {
  update: async ({ request, locals }) => {

    const user = locals.user
    try {
      const formData = await request.formData()
      const data = Object.fromEntries(formData.entries())
      console.log('data', data)
      const accessToken = data.accessToken
      const fbData = { accessToken }

      const db = admin.firestore();
      const docRef = db.collection('users').doc(user.uid);
      await docRef.update(fbData);

      return { success: true }
    } catch (e) {
      return fail(500, {
        message: `Error in updating users: ${e}`
      });
    }
  },
}