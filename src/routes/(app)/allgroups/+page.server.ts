import type { PageServerLoad } from './$types';
import { redis } from '$lib/redis/redis';
import { getData } from '$lib/getCollection';

const ttl = 600

export const load: PageServerLoad = (async () => {
  const redisKeyAllGroupsType = `all_groups_cached`

  let allGroupsCached
  let entity

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

    console.log('entity in allGroups Page Server', entity)

    return {
      'groups': JSON.parse(JSON.stringify(entity))
    };

  } catch (error) {
    console.error(`Error in (app) allgroups +page.server.ts ${error}`, JSON.stringify(error))
  }
});