import type { PageServerLoad } from './$types';
import { redis } from '$lib/redis/redis';
import { getData } from '$lib/getCollection';

let entity = []
const ttl = 600

export const load: PageServerLoad = (async ({ setHeaders }) => {

  try {

    await redis.connect()
    const redisKeyTags = `tags_cached`
    const tagsCached = await redis.get(redisKeyTags)

    if (tagsCached) {
      console.log(`${redisKeyTags} cached`)
      entity = JSON.parse(tagsCached)
    } else {
      console.log(`${redisKeyTags} NOT cached`)
      entity = await getData({
        entity: 'tags',
        max: 100,
        orderByField: 'lastSeen',
        sourceType: ''
      })

      // Store account entity in redis
      await redis.set(redisKeyTags, JSON.stringify(entity), {
        EX: ttl
      })
    }

    setHeaders({ "cache-control": `public, max-age=${ttl}` })

    return {
      'tags': JSON.parse(JSON.stringify(entity))
    };
  } catch (error) {
    console.error(`Error in (app) tags +page.server.ts ${error}`, JSON.stringify(error))
  } finally {
    await redis.disconnect()
  }
});