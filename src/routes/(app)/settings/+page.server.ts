import type { PageServerLoad } from './$types';
import admin from 'firebase-admin';
import { fail, redirect } from '@sveltejs/kit';
import { getDocument } from '$lib/getCollection';

export const load: PageServerLoad = (async ({ locals }) => {

  const user = locals.user

  if (!user) {
    redirect(307, '/')
  }

  let entity

  try {
    entity = await getDocument({ entity: 'users', id: user.uid })
  } catch (error) {
    console.error(`Error getting users document for uid: ${user.uid}`, error)
  }

  return {
    entity,
    user
  };
})

// https://lounge.town/api/v2/search?q=heisenpunk@lounge.town
async function getMastodonAccount({ acct, fetch, instance }) {
  let response = false
  const url = `https://${instance.trim()}/api/v2/search?q=${acct.trim()}`
  try {
    const fetchResponse = await fetch(url)
    if (fetchResponse && fetchResponse.ok) {
      const result = await fetchResponse.json()
      if (result && result.accounts && Array.isArray(result.accounts) && result.accounts.length === 1) {
        const acctId = result.accounts[0].id
        response = acctId
      }
    } else {
      console.error(`Error getting result from search to url: ${url}`, fetchResponse)
    }
  } catch (error) {
    console.error(`Error getting account data from ${url}`, error)
  }

  return response
}

// https://mastodon.social/api/v1/accounts/1

async function checkToken({ accessToken, fetch, instance }) {
  let response = false
  const url = `https://${instance.trim()}/api/v1/preferences`
  try {
    const fetchResponse = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${accessToken.trim()}`,
      },
    })
    if (fetchResponse && fetchResponse.ok) {
      response = true
    } else {
      console.error(`Invalid token check response from url: ${url}, accessToken: ${accessToken}`, fetchResponse)
    }
  } catch (error) {
    console.error(`Error getting token data from ${url}`, error)
  }

  return response
}

export const actions = {
  // update
  update: async ({ request, locals, fetch }) => {

    const user = locals.user

    if (!user) {
      return fail(500, {
        message: `Error in update - No user found!`
      });
    }

    const formData = await request.formData()
    const data = Object.fromEntries(formData.entries())
    const { accessToken, acct, instance, type } = data

    console.log('data', data)
    let accountFound
    let tokenVerified

    switch (type) {
      case 'mastodon':
        accountFound = await getMastodonAccount({ acct, fetch, instance })
        tokenVerified = accountFound ? await checkToken({ accessToken, fetch, instance }) : false

        if (accountFound && tokenVerified) {
          try {

            const fbData = { accessToken, acct, instance }
            const db = admin.firestore();
            const docRef = db.collection('users').doc(user.uid);
            await docRef.update(fbData);

            return { success: true }
          } catch (e) {
            return fail(500, {
              message: `Error in updating users: ${e}`
            });
          }
        } else {
          return fail(404, {
            message: `Could not validate user in Mastodon!`
          });
        }
        break;

      default:
        return fail(500, {
          message: `Error in updating users: no valid type found`
        });
    }
  },
}