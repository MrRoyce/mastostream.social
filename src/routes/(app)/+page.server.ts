import type { PageServerLoad } from '../$types';
import { getCount, getCounts, getWords } from '$lib/getCollection';
import { summarizeCounts } from '$lib/utils/summarizeCounts';
import { convertToK } from '$lib/utils/convertToK';
import { getRandomRange } from '$lib/utils/getRandomRange';
import { redis } from '$lib/redis/redis';

let myWords

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
  user: {
    email: '',
    admin: false
  }
}

export const ssr = false;
export const prerender = false;

export const load: PageServerLoad = async ({ fetch, locals, setHeaders }) => {

  try {

    dashboardData.user = locals.user || { email: '', admin: false }

    await redis.connect()
    const redisKeyDashboard = 'account_dashboard'
    const dashboardCached = await redis.get(redisKeyDashboard)

    if (dashboardCached) {
      console.log('dashboardCached cached')
      dashboardData = JSON.parse(dashboardCached)
    } else {
      console.log('dashboardCached NOT cached')

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

      const { start } = getRandomRange(tags)
      myWords = await getWords({ start, max: 50 })
      dashboardData.words = myWords

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

      // Store dashboard data in redis
      await redis.set(redisKeyDashboard, JSON.stringify(dashboardData), {
        EX: ttl
      })
    }

    setHeaders({ "cache-control": `public, max-age=${ttl}` })

    return {
      ...dashboardData
    };
  } catch (error) {
    console.error(`Error in (app) +page.server.ts ${error}`, JSON.stringify(error))
  } finally {
    await redis.disconnect()
  }
};
