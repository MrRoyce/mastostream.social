import type { PageServerLoad } from './$types';
import { redis } from '$lib/redis/redis';
import { getData, getDocument } from '$lib/getCollection';
import { fail } from '@sveltejs/kit';
import admin from 'firebase-admin';

const ttl = 600

export const load: PageServerLoad = (async ({ locals }) => {

  const user = locals.user

  const redisKeyAllGroupsType = `all_groups_cached:${user.uid || 'all'}`

  let allGroupsCached
  let entity

  const userDocument = (user.uid) ? await getDocument({ entity: 'users', id: user.uid }) : {}

  try {
    if (redis) {
      try {
        allGroupsCached = await redis.get(redisKeyAllGroupsType)
      } catch (error) {
        console.error('Error getting redis in (app) allgroups +page.server.ts', error)
      }
    }

    const checkCache = true  // TODO always check this!

    if (allGroupsCached && checkCache) {
      console.log(`allGroupsCached cached`)
      entity = JSON.parse(allGroupsCached)
    } else {
      console.log(`allGroupsCached NOT cached`)
      entity = await getData({
        entity: 'groups',
        max: 100,
        orderByField: 'created'
      })

      const groupUid = user ? `${user.uid}_${userDocument?.acct}` : undefined;

      if (Array.isArray(entity) && entity.length > 0) {
        entity.forEach((group) => {
          group.creator = group.creatorId === user.uid ? true : false;
          group.moderator = group.groupModerators.includes(groupUid) ? true : false;
          group.member = group.groupMembers.includes(groupUid) ? true : false;
        });
      }

      // Store allgroups entity in redis
      if (redis) {
        try {
          await redis.set(redisKeyAllGroupsType, JSON.stringify(entity), 'EX', ttl)
        } catch (error) {
          console.error('Error setting redis in (app) accounts +page.server.ts', error)
        }
      }
    }

    return {
      'groups': JSON.parse(JSON.stringify(entity)),
      acct: userDocument.acct,
      entity: JSON.parse(JSON.stringify(userDocument)),
      user,
    };

  } catch (error) {
    console.error(`Error in (app) allgroups +page.server.ts ${error}`, JSON.stringify(error))
  }
});

export const actions = {

  join: async ({ request, locals }) => {
    try {
      const user = locals.user
      const formData = (await request.formData())
      const data = Object.fromEntries(formData.entries())

      const redisKeyAllGroupsType = `all_groups_cached:${user.uid || 'all'}`

      const {
        acct,
        groupId,
        groupName,
        groupMembers,
        originalGroups,
        uid,
      } = data

      if (!(user?.uid === uid)) {
        return fail(500, {
          message: `Error in join group - user.uid: ${user?.uid} !== data.uid: ${uid}`
        });
      }

      const originalUsersGroupsObject = originalGroups ? JSON.parse(originalGroups) : []
      const originalGroupMembersObject = groupMembers ? JSON.parse(groupMembers) : []

      // console.log('uid', uid)
      // console.log('groupName', groupName)
      // console.log('acct', acct)
      // console.log('groupId', groupId)
      // console.log('originalGroupMembersObject', originalGroupMembersObject)
      // console.log('originalGroupsObject', originalGroupsObject)

      // First add the user to the groupMembers array
      const newMember = `${uid}_${acct}`
      originalGroupMembersObject.push(newMember)
      const fbGroupMembers = { groupMembers: originalGroupMembersObject }

      const db = admin.firestore();
      const groupsRef = db.collection('groups').doc(groupId);
      await groupsRef.update(fbGroupMembers);

      // Then add the group to the user
      const userGroup = {
        creator: false,
        groupId: groupId,
        joined: admin.firestore.Timestamp.now().toDate(),
        moderator: false,
        name: groupName
      }

      originalUsersGroupsObject.push(userGroup)
      const fbUserGroupData = { groups: originalUsersGroupsObject }

      const userRef = db.collection('users').doc(user.uid);
      await userRef.update(fbUserGroupData);

      // Then update redis
      if (redis) {
        try {
          await redis.del(redisKeyAllGroupsType)
        } catch (error) {
          console.error('Error updating redis in (app) allgroups +page.server.ts', error)
        }
      }

      return { success: true }
    } catch (e) {
      const error = `Error in joining group: ${e}`
      return fail(500, {
        message: error
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
    console.log('data in leave', data)

    if (!(user?.uid === uid)) {
      return fail(400, {
        data,
        message: `Error in leaving group - user.uid: ${user?.uid} !== data.uid: ${uid}`
      });
    } else {
      console.log('found Valid user')
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
      console.log('Group updated')
    } catch (e) {
      return fail(500, {
        message: `Error in allgroups removing user from group collection ${e}`
      });
    }

    //  Now remove the group from the users collection
    const originalGroupsObject = originalGroups ? JSON.parse(originalGroups) : []

    const index = originalGroupsObject.findIndex((group: { groupId: string; }) => group.groupId === groupId)
    console.log('originalGroupsObject ', originalGroupsObject)
    if (index !== -1) {
      console.log('Group found')
      console.log('originalGroupsObject before splice', originalGroupsObject)
      originalGroupsObject.splice(index, 1)
      console.log('originalGroupsObject after splice', originalGroupsObject)

    } else {
      console.log('Group not found')
    }

    try {
      // Remove the group from the users groups
      const fbUserGroupData = { groups: originalGroupsObject }
      const db = admin.firestore();
      const userRef = db.collection('users').doc(user.uid);

      await userRef.update(fbUserGroupData);
      const redisKeyAllGroupsType = `all_groups_cached:${user.uid || 'all'}`

      // Then update redis
      if (redis) {
        try {
          await redis.del(redisKeyAllGroupsType)
        } catch (error) {
          console.error('Error updating redis in (app) allgroups +page.server.ts', error)
        }
      }

      return {
        success: true
      }
    } catch (e) {
      return fail(500, {
        message: `Error in allgroups removing group for user: ${e}`
      });
    }
  }
}