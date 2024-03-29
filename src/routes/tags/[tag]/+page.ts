import type { PageLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';
import { formatToot } from '$lib/utils/formatToot';

// Get tags and its toots
export const load: PageLoad = (async ({ params, url }) => {
  const lowerCase = params.tag && typeof params.tag === 'string' ? params.tag.toLowerCase() : params.tag;

  const tootType = url.searchParams.get('type') || 'human'
  const entity: DocumentData = await getDocument({ entity: 'tags', id: lowerCase });
  const toots: DocumentData[] = await getToots({ entity: 'tags', id: lowerCase, max: 100, orderByField: 'createdAt', tootType })

  const items = toots.map((item) => {
    return formatToot(item)
  })

  return { entity: { ...entity }, id: params.tag, toots: items, tootTypePassed: tootType };
});