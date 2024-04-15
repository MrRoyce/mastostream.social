import { getDocument } from '$lib/getCollection';
import type { LayoutServerLoad } from './$types';


export const load: LayoutServerLoad = (async ({ parent }) => {
  const data = await parent()

  let entity = {}
  if (data.user?.uid) {
    entity = await getDocument({ entity: 'users', id: data.user.uid })
  }

  return { user: data.user, entity };
});