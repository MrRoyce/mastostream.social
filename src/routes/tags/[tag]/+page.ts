import type { PageLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';
import { formatToot } from '$lib/utils/formatToot';

// Get tags and its toots
export const load: PageLoad = (async ({ params }) => {
  const entity: DocumentData = await getDocument({ entity: 'tags', id: params.tag });

  const toots: DocumentData[] = await getToots({ entity: 'tags', id: params.tag, max: 100, orderByField: 'createdAt' })

  const items = toots.map((item) => {
    return formatToot(item)
  })

  return { entity: { ...entity }, toots: items };
});