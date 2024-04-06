import type { PageServerLoad } from './$types';
import { formatToot } from '$lib/utils/formatToot';
import { functions } from "$lib/firebase/client";
import { httpsCallable } from 'firebase/functions';
import { sortByAttribute } from '$lib/utils/sortObject';
import { addMediaAttachmentCounts } from '$lib/utils';

const searchES = httpsCallable(functions, 'searchES');

export const load: PageServerLoad = (async (event) => {

  const term = event.params.term
  const type = event.params.type

  const response = await searchES({ term, type })
  const items = response.data?.data?.hits?.hits.map((item) => {
    const formattedToot = formatToot(item._source)
    return formattedToot
  })

  let sortedItems = sortByAttribute(items, 'createdAt')

  sortedItems = addMediaAttachmentCounts(sortedItems)

  return { success: true, toots: sortedItems, term };
});