import { getDocument } from '$lib/getCollection';
import { fail, redirect } from '@sveltejs/kit';
import admin from 'firebase-admin';
import type { PageServerLoad } from './$types';
import { Timestamp } from "firebase/firestore";

export const load: PageServerLoad = (async ({ locals }) => {
  const user = locals.user

  if (!user) {
    redirect(307, '/')
  }

  let groups = []
  let entity

  try {
    entity = await getDocument({ entity: 'users', id: user.uid })
    groups = entity?.groups || []
  } catch (error) {
    console.error(`Error getting users groups for uid: ${user.uid}`, error)
  }

  return {
    entity,
    groups: JSON.parse(JSON.stringify(groups)),
    user
  };
});

export const actions = {
  update: async ({ request, locals }) => {

    const user = locals.user
    const formData = (await request.formData())
    const data = Object.fromEntries(formData.entries())
    const { originalGroups, moderator, groupName, creator } = data

    const originalGroupsObject = originalGroups ? JSON.parse(originalGroups) : []

    console.log('data in update action', JSON.stringify(data, null, 2))
    console.log('originalGroups in update action', originalGroups)
    // console.log('user in update action', user)

    if (!(user?.uid === data?.uid)) {
      return fail(500, {
        message: `Error in update group - user.uid: ${user?.uid} !== data.uid: ${data?.uid}`
      });
    }

    const updatedGroups = originalGroupsObject.map((originalGroup: { name: any; }) => {
      console.log('names', `originalGroup.name: ${originalGroup.name}, groupName: ${groupName}`)
      if (!(originalGroup.name === groupName)) {
        return originalGroup
      } else {
        return {
          creator: creator ? true : false,
          joined: originalGroup.joined,
          moderator: moderator ? true : false,
          name: groupName
        }
      }
    })

    console.log('updatedGroups', updatedGroups)
    try {
      const fbData = { groups: updatedGroups }
      const db = admin.firestore();
      const docRef = db.collection('users').doc(user.uid);
      await docRef.update(fbData);

      return { success: true }
    } catch (e) {
      return fail(500, {
        message: `Error in updating group for user: ${e}`
      });
    }

    return { success: true }
  },
  add: async ({ request, locals }) => {
    const user = locals.user
    const formData = (await request.formData())
    const data = Object.fromEntries(formData.entries())
    console.log('data', data)

    const {
      acct,
      description,
      groupName,
      mature,
      type,
    } = data

    if (!(user?.uid === data?.uid)) {
      return fail(500, {
        message: `Error in update group - user.uid: ${user?.uid} !== data.uid: ${data?.uid}`
      });
    }

    const groupCreatorId = `${user.uid}_${acct}`

    const group = {
      created: admin.firestore.Timestamp.now().toDate(),
      creatorId: user.uid,
      description,
      groupMembers: [groupCreatorId],
      groupModerators: [groupCreatorId],
      mature: mature ? true : false,
      name: groupName,
      public: type ? true : false,
    }

    console.log('group', group)

    try {
      const fbData = { ...group }
      const db = admin.firestore();
      const docRef = db.collection('groups').doc(groupName);
      await docRef.create(fbData);

      return { success: true }
    } catch (e) {
      return fail(500, {
        message: `Error in adding group for user: ${e}`
      });
    }

  }
}