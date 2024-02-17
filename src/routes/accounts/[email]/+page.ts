import type { PageLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';

export const load: PageLoad = (async ({ params }) => {
  const entity: DocumentData = await getDocument({ entity: 'accounts', id: params.email });

  const toots: DocumentData[] = await getToots({ entity: 'accounts', id: params.email, max: 100, orderByField: 'createdAt' })

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