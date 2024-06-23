import { getData } from '$lib/getCollection';
import { redis } from '$lib/redis/redis';
import { addMediaAttachmentCounts } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ url, setHeaders }) => {

  let toots = []
  const ttl = 600

  try {
    const sourceType = url.searchParams.get('type') ?? 'both'
    const redisKeyTootsType = `toots:cached:${sourceType}`
    const tootsCached = await redis.get(redisKeyTootsType)

    const checkCache = true  // TODO always check this!

    if (tootsCached && checkCache) {
      console.log(`${redisKeyTootsType} for ${sourceType} cached`)
      toots = JSON.parse(tootsCached)
      // not sure why need to re-add the counts??
      toots = addMediaAttachmentCounts(toots)
    } else {
      console.log(`${redisKeyTootsType} for ${sourceType} NOT cached`)
      toots = await getData({
        entity: 'toots',
        max: 100,
        orderByField: 'timestamp',
        sourceType
      })

      toots = addMediaAttachmentCounts(toots)

      // Store toots in redis
      await redis.set(redisKeyTootsType, JSON.stringify(toots), 'EX', ttl)
    }

    setHeaders({ "cache-control": `public, max-age=${ttl}` })

    return {
      'toots': JSON.parse(JSON.stringify(toots))
    };
  } catch (error) {
    console.error(`Error in (app) toots +page.server.ts ${error}`, JSON.stringify(error))
  } finally {
    //await redis.quit()
  }
});