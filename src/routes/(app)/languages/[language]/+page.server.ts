import type { PageServerLoad } from './$types';
import { getLanguage } from '$lib/utils/getLanguage';
import { createClient } from 'redis';
import { VITE_REDIS_HOST, VITE_REDIS_PASSWORD, VITE_REDIS_PORT } from '$env/static/private'
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';
import { formatToot } from '$lib/utils';

// Get languages and its toots
export const load: PageServerLoad = (async ({ fetch, params, setHeaders, url }) => {

  const tootType = url.searchParams.get('type') ?? 'human'

  const languageLowerCase = params.language && typeof params.language === 'string' ? params.language.toLowerCase() : params.language;

  const redisKeyLanguage = `language_${languageLowerCase}`

  const entity: DocumentData = await getDocument({ entity: 'languages', id: languageLowerCase });

  const toots: DocumentData[] = await getToots({ entity: 'languages', id: languageLowerCase, max: 100, orderByField: 'createdAt', tootType })

  const items = toots.map((item) => {
    return formatToot(item)
  })

  const redis = createClient({
    password: VITE_REDIS_PASSWORD,
    socket: {
      host: VITE_REDIS_HOST,
      port: VITE_REDIS_PORT
    }
  });

  await redis.connect()
  let wikiData = {}

  const languageCached = await redis.get(redisKeyLanguage)
  let ttl

  if (languageCached) {
    console.log(`${redisKeyLanguage} found in cache!`)
    ttl = await redis.ttl(redisKeyLanguage)
    setHeaders({ "cache-control": `max-age=${ttl}` })
    wikiData = JSON.parse(languageCached)
  } else {
    console.log(`${redisKeyLanguage} Not in cache`)
    const translatedLanguage = getLanguage(languageLowerCase)
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${translatedLanguage.englishValue}%20Language`
    const res = await fetch(url)

    if (!res.ok) {
      const error = `HTTP error: ${url}, Status: ${res.status}, Text: ${res.statusText}`
      console.error(error)
    } else {
      wikiData = await res.json()

      if (wikiData) {
        const cacheControl = res.headers.get('cache-control')
        if (cacheControl) {
          setHeaders({ "cache-control": cacheControl })
        }

        await redis.set(redisKeyLanguage, JSON.stringify(wikiData), {
          EX: 600
        })
      }
    }
  }

  await redis.disconnect()

  // Need to stringify to remove the timestamp object
  // Then parse to pass an object!!
  const entityObject = JSON.parse(JSON.stringify(entity))
  const tootsObject = JSON.parse(JSON.stringify(items))

  return {
    entity: entityObject,
    id: params.language,
    toots: tootsObject,
    tootTypePassed: tootType,
    wikiData
  }
});