import type { PageServerLoad } from './$types';
import { getDocument, getDocuments } from '$lib/getCollection';
import { redis } from '$lib/redis/redis';

const ttl = 600

// Convert the toots url with the api string
// to be able to get the full toot details!
function replaceUsersSegment(originalUrl: string, replacementText = 'api/v1') {
  const regex = /\/users\/[^\/]*/
  let response
  try {
    response = originalUrl.replace(regex, `/${replacementText}`)
  } catch (err) {
    const error = `Error replacing segment: ${JSON.stringify(err)}`
    console.error(error)
    response = originalUrl
  }
  return response
}

async function getStatusWithCard(fetch: { (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<Response>; (input: string | URL | Request, init?: RequestInit | undefined): Promise<Response>; (arg0: string | URL | Request): any; }, uriWithCard: string | URL | Request) {
  try {
    const response = await fetch(uriWithCard)

    if (!response.ok) {
      const error = `HTTP error: ${uriWithCard}, Status: ${response.status}, Text: ${response.statusText}`
      console.error(error)
      return null
    }

    const result = await response.json()
    // console.log('result from card to call', result)
    return ({ ...result })
  } catch (err) {
    const error = `Error calling external API ${uriWithCard} in getStatusWithCard: ${err.message}.`
    console.error(error, error)
    return null
  }
}

// Get the toot for the passed id
export const load: PageServerLoad = (async ({ fetch, params, setHeaders }) => {

  //await redis.connect()

  let replies: [] = []
  let replyTo = false
  let card = {}
  let entity = {} || null

  const idToLowerCase = params.id?.toLowerCase() || ''

  const redisKeyCard = `toots_card_${idToLowerCase}`
  const redisKeyEntity = `toots_entity_${idToLowerCase}`
  const redisKeyReplies = `toots_replies_${idToLowerCase}`
  const redisKeyReplyTo = `toots_replyTo_${idToLowerCase}`

  const [cardCached, entityCached, repliesCached, replyToCached] = await Promise.all([
    await redis.get(redisKeyCard),
    await redis.get(redisKeyEntity),
    await redis.get(redisKeyReplies),
    await redis.get(redisKeyReplyTo)
  ])

  if (cardCached && entityCached && repliesCached && replyToCached) {
    console.log('cardCached, entityCached, repliesCached, replyToCached cached')
    card = JSON.parse(cardCached)
    entity = JSON.parse(entityCached)
    replies = JSON.parse(repliesCached)
    replyTo = JSON.parse(replyToCached)
  } else {
    console.log('cardCached, entityCached, repliesCached, replyToCached NOT cached')
    // Get Entity
    const lowerCase = params.id && typeof params.id === 'string' ? idToLowerCase : params.id;
    entity = await getDocument({ entity: 'toots', id: lowerCase });

    if (entity && entity.uri) {
      // Get Card
      const uriWithCard = replaceUsersSegment(entity.uri)
      const cardResult = await getStatusWithCard(fetch, uriWithCard)
      card = cardResult?.card || {}
      entity.account = cardResult?.account || entity.account  // Override with better data
      entity.content = cardResult?.content || entity.content  // Override with better data
      entity.mediaAttachments = cardResult?.media_attachments || entity.mediaAttachments  // Override with better data

      // Store entity in redis
      await redis.set(redisKeyEntity, JSON.stringify(entity), 'EX', ttl)

      // Store card in redis
      await redis.set(redisKeyCard, JSON.stringify(card), 'EX', ttl)

      // Get replies
      if (entity.replies && entity.replies.length) {
        replies = await getDocuments({ entity: 'toots', keysArray: entity.replies })

        // Store replies in redis
        if (replies && Array.isArray(replies) && replies.length) {
          await redis.set(redisKeyReplies, JSON.stringify(replies), 'EX', ttl)
        }
      }

      // Get replyTo
      if (entity.inReplyToAccountId && entity.inReplyToId) {
        replyTo = await getDocument({ entity: 'toots', id: `${entity.inReplyToAccountId}_${entity.inReplyToId}` });

        // Store replyTo in redis
        if (replyTo) {
          await redis.set(redisKeyReplyTo, JSON.stringify(replyTo), 'EX', ttl)
        }
      }

      setHeaders({ "cache-control": `public, max-age=${ttl}` })

    } else {
      entity = {}
      console.error(`No entity found for entity: toots and id: ${lowerCase}`)
    }
  }

  //await redis.quit()

  return {
    card: JSON.parse(JSON.stringify(card)),
    entity: JSON.parse(JSON.stringify(entity)),
    id: params.id,
    replies: JSON.parse(JSON.stringify(replies)),
    replyTo: JSON.parse(JSON.stringify(replyTo))
  };
});