import { getDocument } from '$lib/getCollection';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (async ({ locals, parent }) => {
  const data = await parent()

  // what a hack!! to get this working
  const user = locals?.user || data?.user

  let entity = {}
  if (user?.uid) {
    entity = await getDocument({ entity: 'users', id: user.uid })
    entity = JSON.parse(JSON.stringify(entity))
  }

  return { ...locals, entity: { ...entity } };
});