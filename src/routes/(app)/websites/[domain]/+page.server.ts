import type { PageServerLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';
import { formatToot } from '$lib/utils/formatToot';
import { redis } from '$lib/redis/redis';

const ttl = 600
let entity
let toots
let domain = {}

async function getLatestEntityInfo(fetch, uriWithLookup) {
  try {
    const response = await fetch(uriWithLookup)
    if (!response.ok) {
      const error = `HTTP error: ${uriWithLookup}, Status: ${response.status}, Text: ${response.statusText}`
      console.error(error)
      return null
    }

    const result = await response.json()
    return ({ ...result })
  } catch (err) {
    const error = `Error calling external API ${uriWithLookup} in getLatestEntityInfo: ${err.message}.`
    console.error(error, error)
    return null
  }
}

// Get domain and their toots
export const load: PageServerLoad = (async ({ fetch, params, setHeaders }) => {
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
        await getToots({
          entity: 'domains',
          id: lowerCase,
          max: 100,
          orderByField: 'createdAt'
        })
      ]);

      entity = entityFromPromise
      toots = tootsFromPromise

      // Get the latest domain info
      if (entity && entity.domain && entity.instance) {

        const uriWithLookup = `https://${entity.domain}/api/v1/instance`

        domain = await getLatestEntityInfo(fetch, uriWithLookup)

        console.log(`domain from call to ${uriWithLookup}`, domain)

        entity.instance.stats = domain.stats
        entity.instance.background_image = domain.background_image
        entity.instance.thumbnail = domain.thumbnail
        entity.instance.title = domain.title
        entity.instance.description = domain.description
        entity.instance.short_description = domain.short_description
        entity.instance.email = domain.email
        entity.instance.approval_required = domain.approval_required
        entity.instance.languages = domain.languages
        entity.instance.rules = domain.rules
        entity.instance.contact_account = domain.contact_account



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

      } else {
        entity = {}
        console.error(`No entity found for entity: domains and id: ${lowerCase}`)
      }

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