import type { PageServerLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import { fail } from '@sveltejs/kit';
import { functions } from "$lib/firebase/client";
import { httpsCallable } from 'firebase/functions';

const processAdmin = httpsCallable(functions, 'processAdmin');

export const load: PageServerLoad = (async () => {
  return {};
})

let searchId

export const actions = {
  getToot: async ({ request }) => {
    const formData = await request.formData()
    const searchTerm = String(formData.get('entity-search'))
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
      let ref
      const { id, acct, tootId, tags, domain, language } = fbData

      console.log('fbData', fbData)

      // Delete from tags
      if (tags && Array.isArray(tags)) {
        tags.forEach(async tag => {
          const ref = {
            collection: 'tags',
            collectionId: tag,
            subCollection: 'toots',
            subCollectionId: id
          }
          await processAdmin({ ref, task: 'delete' })
        });
      }

      // Delete from account
      ref = {
        collection: 'accounts',
        collectionId: acct,
        subCollection: 'toots',
        subCollectionId: id
      }
      await processAdmin({ ref, task: 'delete' })

      // Delete from domain
      ref = {
        collection: 'domains',
        collectionId: domain,
        subCollection: 'toots',
        subCollectionId: id
      }
      await processAdmin({ ref, task: 'delete' })

      // Delete from Language
      ref = {
        collection: 'languages',
        collectionId: language,
        subCollection: 'toots',
        subCollectionId: id
      }
      await processAdmin({ ref, task: 'delete' })

      // Delete toot
      ref = {
        collection: 'toots',
        collectionId: tootId
      }
      await processAdmin({ ref, task: 'delete' })

      return { success: true }
    } catch (error) {
      return fail(500, {
        message: `Error in deleting toot: ${error}`
      });
    }
  }
}