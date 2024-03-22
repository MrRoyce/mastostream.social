import type { PageServerLoad } from './$types';
import { redis } from '$lib/redis/redis';
import { getData } from '$lib/getCollection';

let entity = []
const ttl = 600

export const load: PageServerLoad = (async ({ url, setHeaders }) => {

  try {
    const sourceType = url.searchParams.get('type') ?? 'human'

    await redis.connect()
    const redisKeyAccountsType = `accounts_cached_${sourceType}`
    const accountsCached = await redis.get(redisKeyAccountsType)

    if (accountsCached) {
      console.log(`accountsCached for ${sourceType} cached`)
      entity = JSON.parse(accountsCached)
    } else {
      console.log(`accountsCached for ${sourceType} NOT cached`)
      entity = await getData({
        entity: 'accounts',
        max: 100,
        orderByField: 'createdAt',
        sourceType
      })

      // Store account entity in redis
      await redis.set(redisKeyAccountsType, JSON.stringify(entity), {
        EX: ttl
      })
    }

    setHeaders({ "cache-control": `public, max-age=${ttl}` })

    return {
      'accounts': JSON.parse(JSON.stringify(entity))
    };
  } catch (error) {
    console.error(`Error in (app) accounts +page.server.ts ${error}`, JSON.stringify(error))
  } finally {
    await redis.disconnect()
  }
});