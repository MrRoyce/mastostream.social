import type { PageServerLoad } from './$types';
import { getCount, getCounts, getData, getWords } from '$lib/getCollection';
import { convertToK, getRandomRange, summarizeCounts } from '$lib/utils';
import { redis } from '$lib/redis/redis';

let myWords
let dashboardToots

const ttl = 600
let dashboardData = {
  latestCounts: {
    accounts: '',
    domains: '',
    languages: '',
    tags: '',
    toots: '',
  },
  counts: {},
  words: [],
  toots: [],
  user: {
    email: '',
    admin: false
  }
}

// export const ssr = false;
// export const prerender = false;

export const load: PageServerLoad = async ({ locals, setHeaders }) => {

  try {

    dashboardData.user = locals.user || { email: '', admin: false }

    //await redis.connect()
    const redisKeyTootsBoth = `toots_cached_both`
    const redisKeyDashboard = 'account_dashboard'

    let dashboardCached
    let tootsCached

    try {
      if (redis) {
        [dashboardCached, tootsCached] = await Promise.all([
          await redis.get(redisKeyDashboard),
          await redis.get(redisKeyTootsBoth)
        ])
      }
    } catch (error) {
      console.error('Error getting redis in (app) +page.server.ts', error)
    }

    const checkCache = true  // TODO always check this!

    if (dashboardCached && tootsCached && checkCache) {
      console.log(`${redisKeyDashboard} && ${redisKeyTootsBoth} cached`)
      dashboardData = JSON.parse(dashboardCached)
      dashboardData.toots = JSON.parse(tootsCached)
    } else {
      console.log(`${redisKeyDashboard} && ${redisKeyTootsBoth} NOT cached`)

      const hours = 6
      let summarizedCounts = []

      const [accounts, counts, domains, languages, tags, toots] = await Promise.all([
        await getCount('accounts'),
        await getCounts(hours),
        await getCount('domains'),
        await getCount('languages'),
        await getCount('tags'),
        await getCount('toots')
      ])

      const valuesToRemove = {
        words: [
          'gootloader'
        ]
      }

      const { start } = getRandomRange(tags, 100)
      myWords = await getWords({ start, max: 50 })
      dashboardData.words = myWords.filter(item => !valuesToRemove.words.includes(item))

      try {
        // Sum up the count to the time period
        summarizedCounts = summarizeCounts({ documents: counts, hours })
      } catch (error) {
        console.error('Error summarizing counts in main page.ts', error)
      }

      dashboardData.counts = summarizedCounts

      dashboardData.latestCounts.accounts = convertToK(accounts)
      dashboardData.latestCounts.domains = convertToK(domains)
      dashboardData.latestCounts.languages = convertToK(languages)
      dashboardData.latestCounts.tags = convertToK(tags)
      dashboardData.latestCounts.toots = convertToK(toots)

      dashboardToots = await getData({
        entity: 'toots',
        max: 100,
        orderByField: 'createdAt',
        sourceType: 'both'
      })

      dashboardData.toots = JSON.parse(JSON.stringify(dashboardToots))

      // Store in redis
      try {
        if (redis) {
          await Promise.all([
            await redis.set(redisKeyDashboard, JSON.stringify(dashboardData), 'EX', ttl),
            await redis.set(redisKeyTootsBoth, JSON.stringify(dashboardToots), 'EX', ttl)
          ])
        }
      } catch (error) {
        console.error('Error setting redis in (app) +page.server.ts', error)
      }
    }

    setHeaders({ "cache-control": `public, max-age=${ttl}` })

    return {
      ...dashboardData
    };
  } catch (error) {
    console.error(`Error in (app) +page.server.ts ${error}`, JSON.stringify(error))
  } finally {
    // await redis.quit()
  }
};
