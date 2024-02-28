import type { PageLoad } from './$types';
import { getDocument } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';

// Get the toot
export const load: PageLoad = (async ({ params }) => {
  const entity: DocumentData = await getDocument({ entity: 'toots', id: params.id });
  console.log('toot', entity)

  return { entity: { ...entity } };
});