import { getData } from '$lib/getCollection';
import { redis } from '$lib/redis/redis';
import type { PageServerLoad } from './$types';

const ttl = 600

export const load: PageServerLoad = (async ({ url, setHeaders }) => {

  let entity = []

  try {
    const sourceType = url.searchParams.get('type') ?? 'both'

    //await redis.connect()
    const redisKeyAccountsType = `accounts:cached:${sourceType}`

    let accountsCached

    if (redis) {
      try {
        accountsCached = await redis.get(redisKeyAccountsType)
      } catch (error) {
        console.error('Error getting redis in (app) accounts +page.server.ts', error)
      }
    }

    const checkCache = true  // TODO always check this!

    if (accountsCached && checkCache) {
      console.log(`accountsCached for ${sourceType} cached`)
      entity = JSON.parse(accountsCached)
    } else {
      console.log(`accountsCached for ${sourceType} NOT cached`)
      entity = await getData({
        entity: 'accounts',
        max: 100,
        orderByField: 'timestamp',
        sourceType
      })

      // Store account entity in redis
      if (redis) {
        try {
          await redis.set(redisKeyAccountsType, JSON.stringify(entity), 'EX', ttl)
        } catch (error) {
          console.error('Error setting redis in (app) accounts +page.server.ts', error)
        }
      }

    }

    setHeaders({ "cache-control": `public, max-age=${ttl}` })

    return {
      'accounts': JSON.parse(JSON.stringify(entity))
    };
  } catch (error) {
    console.error(`Error in (app) accounts +page.server.ts ${error}`, JSON.stringify(error))
  } finally {
    //await redis.quit()
  }
});