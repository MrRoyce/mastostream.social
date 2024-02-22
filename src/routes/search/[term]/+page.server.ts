import type { PageServerLoad } from './$types';
import { formatToot } from '$lib/utils/formatToot';
import { functions } from "$lib/firebase/client";
import { httpsCallable } from 'firebase/functions';

const searchES = httpsCallable(functions, 'searchES');

export const load: PageServerLoad = (async (event) => {

  const term = event.params.term

  const response = await searchES({ term })
  const items = response.data?.data?.hits?.hits.map((item) => {
    return formatToot(item._source)
  })

  return { success: true, toots: items, term };
});