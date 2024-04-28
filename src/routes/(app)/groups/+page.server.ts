import { getGroups } from '$lib/getCollection';
import { fail, redirect } from '@sveltejs/kit';
import admin from 'firebase-admin';
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

export const actions = {
  update: async ({ request, locals }) => {

    const user = locals.user
    const formData = await request.formData()
    const data = Object.fromEntries(formData.entries())

    // console.log('data', data)
    // console.log('user', user)

    if (!(user?.uid === data?.uid)) {
      return fail(500, {
        message: `Error in update group - user.uid: ${user?.uid} !== data.uid: ${data?.uid}`
      });
    }

    try {
      const { groupId } = data
      let { moderator } = data
      moderator = moderator ? true : 'false'

      try {
        const fbData = { moderator }
        const db = admin.firestore();
        const docRef = db.collection(`users/${user.uid}/groups`).doc(groupId);
        await docRef.update(fbData);

        return { success: true }
      } catch (e) {
        return fail(500, {
          message: `Error in updating group for user: ${e}`
        });
      }

      return { success: true }
    } catch (error) {
      return fail(500, {
        message: `Error in updating groups: ${error}`
      });
    }
  }
}