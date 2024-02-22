import type { PageLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';
import { formatToot } from '$lib/utils/formatToot';

// Get domain and their toots
export const load: PageLoad = (async ({ params }) => {

  const entity: DocumentData = await getDocument({ entity: 'domains', id: params.domain });

  const toots: DocumentData[] = await getToots({ entity: 'domains', id: params.domain, max: 100, orderByField: 'createdAt' })

  const items = toots.map((item) => {
    return formatToot(item)
  })

  return { entity: { ...entity }, toots: items };
});