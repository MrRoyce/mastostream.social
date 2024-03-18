import type { PageServerLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';
import { formatToot } from '$lib/utils/formatToot';
import { redis } from '$lib/redis/redis';

const ttl = 600
let entity
let toots

// Get domain and their toots
export const load: PageServerLoad = (async ({ params, setHeaders }) => {
  try {
    await redis.connect()

    const lowerCase = params.domain && typeof params.domain === 'string' ? params.domain.toLowerCase() : params.domain;

    const redisKeyDomain = `domain_acct_${lowerCase}`
    const redisKeyDomainToots = `domain_acct_${lowerCase}_toots`

    const [domainCached, domainTootsCached] = await Promise.all([
      await redis.get(redisKeyDomain),
      await redis.get(redisKeyDomainToots)
    ])

    if (domainCached && domainTootsCached) {
      console.log(`domainCached, domainTootsCached cached for: ${lowerCase}`)
      entity = JSON.parse(domainCached)
      toots = JSON.parse(domainTootsCached)
    } else {
      console.log(`domainCached, domainTootsCached NOT cached for: ${lowerCase}`)

      const [entityFromPromise, tootsFromPromise] = await Promise.all([
        await getDocument({ entity: 'domains', id: lowerCase }),
        await getToots({ entity: 'domains', id: lowerCase, max: 100, orderByField: 'createdAt' })
      ]);

      entity = entityFromPromise
      toots = tootsFromPromise

      const items = toots.map((item) => {
        return formatToot(item)
      })

      // Store entity in redis
      await redis.set(redisKeyDomain, JSON.stringify(entity), {
        EX: ttl
      })

      // Store toots for the domain in redis
      toots = items
      await redis.set(redisKeyDomainToots, JSON.stringify(items), {
        EX: ttl
      })

    }

    setHeaders({ "cache-control": `public, max-age=${ttl}` })

    return {
      entity: JSON.parse(JSON.stringify(entity)),
      id: params.domain,
      toots: JSON.parse(JSON.stringify(toots))
    };

  } catch (error) {
    console.error(`Error in (app) websites [domain] +page.server.ts ${error}`, JSON.stringify(error))
  } finally {
    await redis.disconnect()
  }
});