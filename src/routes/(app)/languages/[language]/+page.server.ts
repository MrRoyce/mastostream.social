import type { PageServerLoad } from './$types';
import { getLanguage } from '$lib/utils/getLanguage';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';
import { formatToot } from '$lib/utils';
import { redis } from '$lib/redis/redis';

// Get languages and its toots
export const load: PageServerLoad = (async ({ fetch, params, setHeaders, url }) => {

  const tootType = url.searchParams.get('type') ?? 'both'
  const languageLowerCase = params.language && typeof params.language === 'string' ? params.language.toLowerCase() : params.language;
  const redisKeyLanguage = `language_${languageLowerCase}`
  const redisKeyLanguagesEntity = `languages_${languageLowerCase}`
  const redisKeyLanguagesToots = `languages_${languageLowerCase}_toots`

  await redis.connect()

  let wikiData = {}
  let entity: DocumentData | null
  let toots: DocumentData[] | null
  let entityObject = {}
  let tootsObject = {}
  const ttl = 600

  const [languageCached, entityCached, tootsCached] = await Promise.all([
    await redis.get(redisKeyLanguage),
    await redis.get(redisKeyLanguagesEntity),
    await redis.get(redisKeyLanguagesToots)
  ])

  if (languageCached) {
    wikiData = JSON.parse(languageCached)
  } else {
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
          EX: ttl
        })
      }
    }
  }

  if (entityCached) {
    entityObject = JSON.parse(entityCached)
  } else {
    entity = await getDocument({ entity: 'languages', id: languageLowerCase });
    entityObject = JSON.parse(JSON.stringify(entity))
    await redis.set(redisKeyLanguagesEntity, JSON.stringify(entity), {
      EX: ttl
    })
  }

  if (tootsCached) {
    tootsObject = JSON.parse(tootsCached)
  } else {
    toots = await getToots({ entity: 'languages', id: languageLowerCase, max: 100, orderByField: 'createdAt', tootType })
    const items = toots.map((item) => {
      return formatToot(item)
    })
    tootsObject = JSON.parse(JSON.stringify(items))
    await redis.set(redisKeyLanguagesToots, JSON.stringify(items), {
      EX: ttl
    })
  }

  await redis.quit()

  if (languageCached && entityCached && tootsCached) {
    setHeaders({ "cache-control": `public, max-age=${ttl}` })
  }

  return {
    entity: entityObject,
    id: params.language,
    toots: tootsObject,
    tootTypePassed: tootType,
    wikiData
  }
});