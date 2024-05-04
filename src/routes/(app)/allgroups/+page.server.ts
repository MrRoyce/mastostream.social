import type { PageServerLoad } from './$types';
import { redis } from '$lib/redis/redis';
import { getData, getDocument } from '$lib/getCollection';
import { fail } from '@sveltejs/kit';
import admin from 'firebase-admin';

const ttl = 600

export const load: PageServerLoad = (async ({ locals }) => {

  const user = locals.user

  if (!user) {
    redirect(307, '/')
  }

  const redisKeyAllGroupsType = `all_groups_cached`

  let allGroupsCached
  let entity

  const userDocument = await getDocument({ entity: 'users', id: user.uid })

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

      return { success: true }
    } catch (e) {
      const error = `Error in joining group: ${e}`
      return fail(500, {
        message: error
      });
    }
  }
}