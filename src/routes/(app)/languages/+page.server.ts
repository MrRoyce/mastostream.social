import type { PageServerLoad } from './$types';
import { redis } from '$lib/redis/redis';
import { getData } from '$lib/getCollection';

let entity = []
const ttl = 600

export const load: PageServerLoad = (async ({ setHeaders }) => {

  try {

    //await redis.connect()
    const redisKeyLanguages = `languages_cached`
    const languagesCached = await redis.get(redisKeyLanguages)

    if (languagesCached) {
      console.log(`${redisKeyLanguages} cached`)
      entity = JSON.parse(languagesCached)
    } else {
      console.log(`${redisKeyLanguages} NOT cached`)
      entity = await getData({
        entity: 'languages',
        max: 100,
        orderByField: 'lastSeen',
        sourceType: ''
      })

      // Store account entity in redis
      await redis.set(redisKeyLanguages, JSON.stringify(entity), 'EX', ttl)
    }

    setHeaders({ "cache-control": `public, max-age=${ttl}` })

    return {
      'languages': JSON.parse(JSON.stringify(entity))
    };
  } catch (error) {
    console.error(`Error in (app) languages +page.server.ts ${error}`, JSON.stringify(error))
  } finally {
    //await redis.quit()
  }
});