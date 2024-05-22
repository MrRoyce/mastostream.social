import type { PageServerLoad } from './$types';
import { getDocument, getToots } from '$lib/getCollection';
import { redis } from '$lib/redis/redis';
import { addMediaAttachmentCounts } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';

const ttl = 600

const replaceFromString = 'users/'
const replaceToString = 'api/v1/accounts/lookup?acct='

async function getLatestEntityInfo(fetch, uriWithLookup) {
  try {
    const response = await fetch(uriWithLookup)
    if (!response.ok) {
      const error = `HTTP error: ${uriWithLookup}, Status: ${response.status}, Text: ${response.statusText}`
      console.error(error)
      return null
    }

    const result = await response.json()
    return ({ ...result })
  } catch (err) {
    const error = `Error calling external API ${uriWithLookup} in getStatusWithCard: ${err.message}.`
    console.error(error, error)
    return null
  }
}

// Get account and their toots
export const load: PageServerLoad = (async ({ fetch, locals, params, setHeaders }) => {

  const user = locals.user

  let entity
  let toots
  let acct = {}

  if (!params.acct || params.acct.length > 50) {
    console.warn('params.acct.length > 50', params.acct.length)
    throw redirect(307, '/')
  }

  try {

    const lowerCase = params.acct && typeof params.acct === 'string' ? params.acct.toLowerCase() : params.acct;

    const redisKeyAccount = `account_acct:${lowerCase}`
    const redisKeyAccountToots = `account_acct:${lowerCase}:toots`

    const [accountCached, accountTootsCached] = await Promise.all([
      await redis.get(redisKeyAccount),
      await redis.get(redisKeyAccountToots)
    ])

    const checkCache = true  // TODO always check this!

    if (accountCached && accountTootsCached && checkCache) {
      entity = JSON.parse(accountCached)
      toots = JSON.parse(accountTootsCached)
      // not sure why need to re-add the counts??
      toots = addMediaAttachmentCounts(toots)
    } else {
      const [entityFromPromise, tootsFromPromise] = await Promise.all([
        await getDocument({ entity: 'accounts', id: lowerCase }),
        await getToots({
          entity: 'accounts',
          id: lowerCase,
          max: 100,
          orderByField: 'createdAt',
          tootType: 'both'
        })
      ]);

      entity = entityFromPromise
      toots = tootsFromPromise

      // Get the latest account info
      if (entity) {
        if (entity.uri) {
          const uriWithLookup = entity.uri.replace(replaceFromString, replaceToString)
          try {
            acct = await getLatestEntityInfo(fetch, uriWithLookup)

            // Need to have optional chaining in case
            // the call to get the latest account fails!
            entity.followingCount = acct?.following_count || entity.followingCount
            entity.followersCount = acct?.followers_count || entity.followersCount
            entity.statusesCount = acct?.statuses_count || entity.statusesCount
            entity.header = acct?.header || entity.header
            entity.headerStatic = acct.header_static || entity.headerStatic
            entity.avatar = acct?.avatar || entity.avatar
            entity.avatarStatic = acct?.avatar_static || entity.avatarStatic
          } catch (error) {
            console.error(`Error fetching ${uriWithLookup} in (app) accounts [acct] +page.server.ts ${error}`, JSON.stringify(error))
          }
        }

        // Store account entity in redis
        await redis.set(redisKeyAccount, JSON.stringify(entity), 'EX', ttl)

        toots = addMediaAttachmentCounts(toots)

        // Store account toots in redis
        await redis.set(redisKeyAccountToots, JSON.stringify(toots), 'EX', ttl)

      } else {
        entity = {}
        console.error(`No entity found for entity: accounts and id: ${lowerCase}`)
      }
    }

    setHeaders({ "cache-control": `public, max-age=${ttl}` })

    const response = {
      entity: JSON.parse(JSON.stringify(entity)),
      id: params.acct,
      toots: JSON.parse(JSON.stringify(toots)),
      user
    }

    // console.log('response in accounts', response)

    return response;

  } catch (error) {
    console.error(`Error in (app) accounts [acct] +page.server.ts ${error}`, JSON.stringify(error))

  } finally {
    //await redis.quit()
  }

});

export const actions = {
  message: async ({ request, locals }) => {
    try {
      const user = locals.user
      const formData = (await request.formData())
      const data = Object.fromEntries(formData.entries())

      const {
        sendTo,
        message,
        subject,
        uid,
      } = data

      if (!(user?.uid === uid)) {
        return fail(500, {
          message: `Error in send message - user.uid: ${user?.uid} !== data.uid: ${uid}`
        });
      }

      console.log(`sendTo: ${sendTo}, message: ${message}, subject: ${subject}, uid: ${uid}`)

      return { success: true }
    } catch (e) {
      const error = `Error in sending message: ${e}`
      return fail(500, {
        message: error
      });
    }
  }
}