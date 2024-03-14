import type { PageLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';
import { formatToot } from '$lib/utils/formatToot';

// Get domain and their toots
export const load: PageLoad = (async ({ params }) => {
  const lowerCase = params.domain && typeof params.domain === 'string' ? params.domain.toLowerCase() : params.domain;

  const entity: DocumentData = await getDocument({ entity: 'domains', id: lowerCase });
  const toots: DocumentData[] = await getToots({ entity: 'domains', id: lowerCase, max: 100, orderByField: 'createdAt' })
  const items = toots.map((item) => {
    return formatToot(item)
  })

  return { entity: { ...entity }, id: params.domain, toots: items };
});