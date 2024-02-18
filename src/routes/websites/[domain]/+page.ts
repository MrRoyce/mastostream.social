import type { PageLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';

// Get domain and their toots
export const load: PageLoad = (async ({ params }) => {

  const entity: DocumentData = await getDocument({ entity: 'domains', id: params.domain });

  const toots: DocumentData[] = await getToots({ entity: 'domains', id: params.domain, max: 100, orderByField: 'createdAt' })

  console.log('entity', entity)

  const items = toots.map((item) => {
    return {
      id: item.id,
      sensitive: !item.sensitive,
      createdAt: item.createdAt,
      acct: item.acct,
      content: item.content,
      uri: item.uri,
      language: item.language,
      visibility: item.visibility,
    }
  })

  return { entity: { ...entity }, toots: items };
});