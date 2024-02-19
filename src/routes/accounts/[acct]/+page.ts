import type { PageLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';
import { formatToot } from '$lib/utils/formatToot';

// Get account and their toots
export const load: PageLoad = (async ({ params }) => {
  const entity: DocumentData = await getDocument({ entity: 'accounts', id: params.acct });

  const toots: DocumentData[] = await getToots({ entity: 'accounts', id: params.acct, max: 100, orderByField: 'createdAt' })

  const items = toots.map((item) => {
    return formatToot(item)
  })

  return { entity: { ...entity }, toots: items };
});