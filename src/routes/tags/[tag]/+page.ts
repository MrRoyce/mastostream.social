import type { PageLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';

// Get tags and its toots
export const load: PageLoad = (async ({ params }) => {
  const entity: DocumentData = await getDocument({ entity: 'tags', id: params.tag });

  const toots: DocumentData[] = await getToots({ entity: 'tags', id: params.tag, max: 100, orderByField: 'createdAt' })

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