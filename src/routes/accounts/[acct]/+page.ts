import type { PageLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';

// Get account and their toots
export const load: PageLoad = (async ({ params }) => {
  const lowerCase = params.acct && typeof params.acct === 'string' ? params.acct.toLowerCase() : params.acct;
  const [entity, toots] = await Promise.all([
    await getDocument({ entity: 'accounts', id: lowerCase }),
    await getToots({ entity: 'accounts', id: lowerCase, max: 100, orderByField: 'createdAt' })
  ]);

  return { entity, id: params.acct, toots };
});
