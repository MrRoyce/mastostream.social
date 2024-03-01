import type { PageLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';

// Get account and their toots
export const load: PageLoad = (async ({ params }) => {
  const [entity, toots] = await Promise.all([
    await getDocument({ entity: 'accounts', id: params.acct }),
    await getToots({ entity: 'accounts', id: params.acct, max: 100, orderByField: 'createdAt' })
  ]);

  return { entity, id: params.acct, toots };
});
