import type { PageLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';

// Get languages and its toots
export const load: PageLoad = (async ({ params }) => {
  const entity: DocumentData = await getDocument({ entity: 'languages', id: params.language });

  const toots: DocumentData[] = await getToots({ entity: 'languages', id: params.language, max: 100, orderByField: 'createdAt' })

  const items = toots.map((item) => {

    return {
      id: item.id,
      createdAt: item.createdAt,
      sensitive: !item.sensitive,
      content: item.content,
      uri: item.uri,
      language: item.language,
      visibility: item.visibility,
    }
  })

  return { entity: { ...entity }, toots: items };
});