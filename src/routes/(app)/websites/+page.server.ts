import type { PageServerLoad } from './$types';
import { redis } from '$lib/redis/redis';
import { getData } from '$lib/getCollection';

let entity = []
const ttl = 600

export const load: PageServerLoad = (async ({ setHeaders }) => {

  try {

    //await redis.connect()
    const redisKeyDomains = `domains_cached`
    const domainsCached = await redis.get(redisKeyDomains)

    if (domainsCached) {
      console.log(`${redisKeyDomains} cached`)
      entity = JSON.parse(domainsCached)
    } else {
      console.log(`${redisKeyDomains} NOT cached`)
      entity = await getData({
        entity: 'domains',
        max: 100,
        orderByField: 'lastSeen',
        sourceType: ''
      })

      // Store account entity in redis
      await redis.set(redisKeyDomains, JSON.stringify(entity), 'EX', ttl)
    }

    setHeaders({ "cache-control": `public, max-age=${ttl}` })

    return {
      'domains': JSON.parse(JSON.stringify(entity))
    };
  } catch (error) {
    console.error(`Error in (app) domains +page.server.ts ${error}`, JSON.stringify(error))
  } finally {
    //await redis.quit()
  }
});