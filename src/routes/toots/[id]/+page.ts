import type { PageLoad } from './$types';
import { getDocument, getDocuments } from '$lib/getCollection';
import type { DocumentData } from 'firebase/firestore';

function replaceUsersSegment(originalUrl, replacementText) {
  const textToReplace = replacementText || 'api/v1'
  const regex = /\/users\/[^\/]*/
  let response
  try {
    response = originalUrl.replace(regex, `/${textToReplace}`)
  } catch (err) {
    const error = `Error replacing segment: ${JSON.stringify(err)}`
    console.error(error)
    writeLog('error', error)
    response = originalUrl
  }
  return response
}

// Get the toot
export const load: PageLoad = (async ({ params }) => {
  let replies = []
  let replyTo = false
  let card

  async function getStatusWithCard(uriWithCard: string | URL | Request) {
    try {
      const response = await fetch(uriWithCard)

      if (!response.ok) {
        const error = `HTTP error: ${url}, Status: ${response.status}, Text: ${response.statusText}`
        console.error(error)
        return null
      }

      const result = await response.json()
      // console.log('result from card to call', result)
      return ({ card: result.card, account: result.account })
    } catch (err) {
      const error = `Error calling external API ${uriWithCard} in getStatusWithCard: ${err.message}.`
      console.error(error, error)
      return null
    }
  }

  const entity: DocumentData = await getDocument({ entity: 'toots', id: params.id });

  if (entity.replies && entity.replies.length) {
    replies = await getDocuments({ entity: 'toots', keysArray: entity.replies })
  }
  if (entity.inReplyToAccountId && entity.inReplyToId) {
    replyTo = await getDocument({ entity: 'toots', id: `${entity.inReplyToAccountId}_${entity.inReplyToId}` });
  }

  const uriWithCard = replaceUsersSegment(entity.uri)
  const cardResult = await getStatusWithCard(uriWithCard)
  card = cardResult?.card || null
  entity.account = cardResult?.account || entity.account  // Override with better data

  return { card, entity: { ...entity }, id: params.id, replies, replyTo };
});