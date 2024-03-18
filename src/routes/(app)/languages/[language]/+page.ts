import type { PageLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';
import { formatToot } from '$lib/utils/formatToot';

// Get languages and its toots
export const load: PageLoad = (async ({ data, params, url }) => {

  const tootType = url.searchParams.get('type') ?? 'human'

  const languageLowerCase = params.language && typeof params.language === 'string' ? params.language.toLowerCase() : params.language;

  const entity: DocumentData = await getDocument({ entity: 'languages', id: languageLowerCase });

  const toots: DocumentData[] = await getToots({ entity: 'languages', id: languageLowerCase, max: 100, orderByField: 'createdAt', tootType })

  const items = toots.map((item) => {
    return formatToot(item)
  })

  return { entity: { ...entity }, id: params.language, toots: items, tootTypePassed: tootType, wikiData: data.wikiData };
});