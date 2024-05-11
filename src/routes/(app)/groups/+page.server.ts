import { getDocument } from '$lib/getCollection';
import { fail, redirect } from '@sveltejs/kit';
import admin from 'firebase-admin';
import type { PageServerLoad } from './$types';

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
    entity: JSON.parse(JSON.stringify(entity)),
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

    if (!(user?.uid === data?.uid)) {
      return fail(500, {
        message: `Error in update group - user.uid: ${user?.uid} !== data.uid: ${data?.uid}`
      });
    }

    const updatedGroups = originalGroupsObject.map((originalGroup: { name: any; }) => {
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

    // console.log('updatedGroups', updatedGroups)
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

    const {
      acct,
      description,
      groupName,
      originalGroups,
      mature,
      type,
    } = data

    const originalGroupsObject = originalGroups ? JSON.parse(originalGroups) : []

    if (!(user?.uid === data?.uid)) {
      return fail(500, {
        message: `Error in adding group - user.uid: ${user?.uid} !== data.uid: ${data?.uid}`
      });
    }

    const groupCreatorId = `${user.uid}_${acct}`

    const group = {
      created: admin.firestore.Timestamp.now().toDate(),
      creatorId: user.uid,
      description,
      groupMembers: [groupCreatorId],
      groupModerators: [groupCreatorId],
      mature,
      name: groupName,
      type,
    }

    try {
      const fbData = { ...group }
      const db = admin.firestore();
      const groupsRef = db.collection('groups').doc();
      await groupsRef.set(fbData);

      // Now add the group to the users groups
      const userGroup = {
        creator: true,
        groupId: groupsRef.id,
        joined: admin.firestore.Timestamp.now().toDate(),
        moderator: true,
        name: groupName
      }

      originalGroupsObject.push(userGroup)
      const fbUserGroupData = { groups: originalGroupsObject }
      const userRef = db.collection('users').doc(user.uid);

      await userRef.update(fbUserGroupData);

      console.log('groupId in server: groupsRef.id - ', groupsRef.id)

      return {
        success: true,
        groupId: groupsRef.id,
        mature,
        type,
        message: 'Document added'
      }
    } catch (e) {
      return fail(500, {
        message: `Error in adding group for user: ${e}`
      });
    }

  },

  leave: async ({ request, locals }) => {
    const user = locals.user
    const formData = (await request.formData())
    const data = Object.fromEntries(formData.entries())

    const {
      acct,
      groupId,
      originalGroups,
      uid
    } = data

    if (!(user?.uid === uid)) {
      return fail(400, {
        data,
        message: `Error in leaving group - user.uid: ${user?.uid} !== data.uid: ${uid}`
      });
    }

    try {
      // First remove the user from the groups colllection
      const groupMemberId = `${uid}_${acct}`
      const db = admin.firestore();
      const groupsRef = db.collection('groups').doc(groupId);
      const groupSnapshot = await getDocument({ entity: 'groups', id: groupId })
      const groupMembers = groupSnapshot?.groupMembers || []
      const updatedGroupMembers = groupMembers.filter((member: string) => {
        if (groupMemberId !== member) {
          return member
        }
      })
      const fbData = { groupMembers: updatedGroupMembers }
      await groupsRef.update(fbData);
    } catch (e) {
      return fail(500, {
        message: `Error in removing user from group collection ${e}`
      });
    }

    //  Now remove the group from the users collection
    const originalGroupsObject = originalGroups ? JSON.parse(originalGroups) : []

    const index = originalGroupsObject.findIndex((group: { groupId: string; }) => group.groupId === groupId)

    if (index !== -1) {
      originalGroupsObject.splice(index, 1)
    }

    try {
      // Remove the group from the users groups
      const db = admin.firestore();

      const fbUserGroupData = { groups: originalGroupsObject }
      const userRef = db.collection('users').doc(user.uid);

      await userRef.update(fbUserGroupData);

      return {
        success: true
      }
    } catch (e) {
      return fail(500, {
        message: `Error in removing group for user: ${e}`
      });
    }

  }
}