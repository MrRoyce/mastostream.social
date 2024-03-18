import type { PageServerLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import { redis } from '$lib/redis/redis';

const ttl = 600
let entity
let toots

// Get account and their toots
export const load: PageServerLoad = (async ({ params, setHeaders }) => {

  try {


    await redis.connect()

    const lowerCase = params.acct && typeof params.acct === 'string' ? params.acct.toLowerCase() : params.acct;

    const redisKeyAccount = `account_acct_${lowerCase}`
    const redisKeyAccountToots = `account_acct_${lowerCase}_toots`

    const [accountCached, accountTootsCached] = await Promise.all([
      await redis.get(redisKeyAccount),
      await redis.get(redisKeyAccountToots)
    ])

    if (accountCached && accountTootsCached) {
      console.log('accountCached, accountTootsCached cached')
      entity = JSON.parse(accountCached)
      toots = JSON.parse(accountTootsCached)
    } else {
      console.log('accountCached, accountTootsCached NOT cached')
      const [entityFromPromise, tootsFromPromise] = await Promise.all([
        await getDocument({ entity: 'accounts', id: lowerCase }),
        await getToots({ entity: 'accounts', id: lowerCase, max: 100, orderByField: 'createdAt' })
      ]);
      entity = entityFromPromise
      toots = tootsFromPromise

      // Store entity in redis
      await redis.set(redisKeyAccount, JSON.stringify(entity), {
        EX: ttl
      })

      // Store card in redis
      await redis.set(redisKeyAccountToots, JSON.stringify(toots), {
        EX: ttl
      })
    }

    setHeaders({ "cache-control": `max-age=${ttl}` })

    return {
      entity: JSON.parse(JSON.stringify(entity)),
      id: params.acct,
      toots: JSON.parse(JSON.stringify(toots))
    };

  } catch (error) {
    console.error(`Error in accounts +page.server.ts ${error}`, JSON.stringify(error))

  } finally {
    await redis.disconnect()
  }

});
