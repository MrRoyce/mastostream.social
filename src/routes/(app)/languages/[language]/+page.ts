import type { PageLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';
import { formatToot } from '$lib/utils/formatToot';
import { getLanguage } from '$lib/utils/getLanguage';

async function getWikiMediaData(fetch, language) {
  const translatedLanguage = getLanguage(language)
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${translatedLanguage.englishValue}%20Language`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      const error = `HTTP error: ${url}, Status: ${response.status}, Text: ${response.statusText}`
      console.error(error)
      return null
    }

    const result = await response.json()
    return ({ ...result })
  } catch (err) {
    const error = `Error calling external API ${url} in getWikiMediaData: ${err.message}.`
    console.error(error, error)
    return null
  }
}

// Get languages and its toots
export const load: PageLoad = (async ({ fetch, params, url }) => {

  const tootType = url.searchParams.get('type') ?? 'human'

  const lowerCase = params.language && typeof params.language === 'string' ? params.language.toLowerCase() : params.language;

  const entity: DocumentData = await getDocument({ entity: 'languages', id: lowerCase });

  const toots: DocumentData[] = await getToots({ entity: 'languages', id: lowerCase, max: 100, orderByField: 'createdAt', tootType })

  const items = toots.map((item) => {
    return formatToot(item)
  })

  const wikiData = await getWikiMediaData(fetch, params.language)

  return { entity: { ...entity }, id: params.language, toots: items, wikiData: { ...wikiData }, tootTypePassed: tootType };
});