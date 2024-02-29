import type { PageLoad } from './$types';
import { getDocument, getDocuments } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';

// Get the toot
export const load: PageLoad = (async ({ params }) => {
  let replies = []
  const entity: DocumentData = await getDocument({ entity: 'toots', id: params.id });

  if (entity.replies && entity.replies.length) {
    replies = await getDocuments({ entity: 'toots', keysArray: entity.replies })
  }

  return { entity: { ...entity }, replies };
});