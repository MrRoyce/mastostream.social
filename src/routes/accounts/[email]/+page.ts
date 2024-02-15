import type { PageLoad } from './$types';
import { getDocument } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';

export const load: PageLoad = (async ({ params }) => {
  const response: DocumentData = await getDocument({ entity: 'accounts', id: params.email });

  return { ...response };
});