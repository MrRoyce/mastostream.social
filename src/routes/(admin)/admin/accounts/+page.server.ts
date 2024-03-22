import type { PageServerLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = (async () => {
  return {};
})

let searchId

export const actions = {
  getToot: async ({ request }) => {
    const formData = await request.formData()
    const searchTerm = String(formData.get('simple-search'))
    searchId = searchTerm && typeof searchTerm === 'string' ? searchTerm.toLowerCase() : ''
    searchId = (searchId.startsWith('@')) ? searchId.slice(1) : searchId

    const entity = await getDocument({ entity: 'accounts', id: searchId })
    const toots = await getToots({
      entity: 'accounts',
      id: searchId,
      max: 100,
      orderByField: 'createdAt',
      tootType: 'both'
    })

    return {
      entity: JSON.parse(JSON.stringify(entity)),
      toots: JSON.parse(JSON.stringify(toots))
    }
  },
  deleteToot: async ({ request }) => {
    try {
      const formData = await request.formData()
      const data = Object.fromEntries(formData.entries())
      const fbData = { ...data }
      console.log('fbData.tootId', fbData.tootId)
      return { success: true }
    } catch (error) {
      return fail(500, {
        message: `Error in deleting toot: ${error}`
      });
    }
  }
}