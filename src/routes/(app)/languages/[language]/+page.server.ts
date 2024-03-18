import type { PageServerLoad } from './$types';
import { getLanguage } from '$lib/utils/getLanguage';
import { createClient } from 'redis';
import { VITE_REDIS_HOST, VITE_REDIS_PASSWORD, VITE_REDIS_PORT } from '$env/static/private'

// Get languages and its toots
export const load: PageServerLoad = (async ({ fetch, params, setHeaders }) => {

  const languageLowerCase = params.language && typeof params.language === 'string' ? params.language.toLowerCase() : params.language;

  const redis = createClient({
    password: VITE_REDIS_PASSWORD,
    socket: {
      host: VITE_REDIS_HOST,
      port: VITE_REDIS_PORT
    }
  });

  await redis.connect()
  let wikiData = {}

  const cached = await redis.get(languageLowerCase)
  let ttl

  if (cached) {
    console.log(`${languageLowerCase} found in cache!`)
    ttl = await redis.ttl(languageLowerCase)
    setHeaders({ "cache-control": `max-age=${ttl}` })
    wikiData = JSON.parse(cached)
  } else {
    console.log(`${languageLowerCase} Not in cache`)
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

        redis.set(languageLowerCase, JSON.stringify(wikiData), {
          EX: 60000
        })
      }
    }
  }

  redis.disconnect()

  return { wikiData: { ...wikiData } };
});