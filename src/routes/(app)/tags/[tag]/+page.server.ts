import type { PageServerLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import { formatToot } from '$lib/utils/formatToot';
import { redis } from '$lib/redis/redis';

const ttl = 600
let entity
let toots

// Get tags and its toots
export const load: PageServerLoad = (async ({ params, url, setHeaders }) => {

  try {
    //await redis.connect()

    const tootType = url.searchParams.get('type') || 'both'
    const paramValueToLowerCase = params.tag && typeof params.tag === 'string' ? params.tag.toLowerCase() : params.tag;

    const redisKeyTag = `tags_acct_${paramValueToLowerCase}`
    const redisKeyTagToots = `tags_acct_${paramValueToLowerCase}_toots_${tootType}`

    const [tagCached, tagTootsCached] = await Promise.all([
      await redis.get(redisKeyTag),
      await redis.get(redisKeyTagToots)
    ])

    if (tagCached && tagTootsCached) {
      console.log(`tagCached, tagTootsCached cached for: ${paramValueToLowerCase} ${tootType}`)
      entity = JSON.parse(tagCached)
      toots = JSON.parse(tagTootsCached)
    } else {
      console.log(`tagCached, tagTootsCached NOT cached for: ${paramValueToLowerCase} ${tootType}`)
      const [entityFromPromise, tootsFromPromise] = await Promise.all([
        await getDocument({ entity: 'tags', id: paramValueToLowerCase }),
        await getToots({ entity: 'tags', id: paramValueToLowerCase, max: 100, orderByField: 'createdAt', tootType })
      ]);

      entity = entityFromPromise
      toots = tootsFromPromise

      const items = toots.map((item) => {
        return formatToot(item)
      })

      // Store entity in redis
      await redis.set(redisKeyTag, JSON.stringify(entity), 'EX', ttl)

      // Store toots for the tag in redis
      toots = items
      await redis.set(redisKeyTagToots, JSON.stringify(items), 'EX', ttl)
    }

    setHeaders({ "cache-control": `public, max-age=${ttl}` })

    return {
      entity: JSON.parse(JSON.stringify(entity)),
      id: params.tag,
      toots: JSON.parse(JSON.stringify(toots)),
      tootTypePassed: tootType
    };

  } catch (error) {
    console.error(`Error in (app) tags [tag] +page.server.ts ${error}`, JSON.stringify(error))

  } finally {
    //await redis.quit()
  }
});