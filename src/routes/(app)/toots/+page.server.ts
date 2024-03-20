import type { PageServerLoad } from './$types';
import { redis } from '$lib/redis/redis';
import { getData } from '$lib/getCollection';

let entity = []
const ttl = 600

export const load: PageServerLoad = (async ({ url, setHeaders }) => {

  try {
    const sourceType = url.searchParams.get('type') ?? 'human'

    await redis.connect()
    const redisKeyTootsType = `toots_cached_${sourceType}`
    const tootsCached = await redis.get(redisKeyTootsType)

    if (tootsCached) {
      console.log(`${redisKeyTootsType} for ${sourceType} cached`)
      entity = JSON.parse(tootsCached)
    } else {
      console.log(`${redisKeyTootsType} for ${sourceType} NOT cached`)
      entity = await getData({
        entity: 'toots',
        max: 100,
        orderByField: 'createdAt',
        sourceType
      })

      // Store account entity in redis
      await redis.set(redisKeyTootsType, JSON.stringify(entity), {
        EX: ttl
      })
    }

    setHeaders({ "cache-control": `public, max-age=${ttl}` })

    return {
      'toots': JSON.parse(JSON.stringify(entity))
    };
  } catch (error) {
    console.error(`Error in (app) toots +page.server.ts ${error}`, JSON.stringify(error))
  } finally {
    await redis.disconnect()
  }
});