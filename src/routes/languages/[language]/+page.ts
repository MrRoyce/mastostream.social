import type { PageLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';
import { formatToot } from '$lib/utils/formatToot';

// Get languages and its toots
export const load: PageLoad = (async ({ params }) => {
  const entity: DocumentData = await getDocument({ entity: 'languages', id: params.language });

  const toots: DocumentData[] = await getToots({ entity: 'languages', id: params.language, max: 100, orderByField: 'createdAt' })

  const items = toots.map((item) => {

    return formatToot(item)
  })

  return { entity: { ...entity }, toots: items };
});