import type { PageServerLoad } from './$types';
import { getCount, getCounts } from '$lib/getCollection';
import { convertToK, summarizeCounts } from '$lib/utils';
import { redis } from '$lib/redis/redis';
import { redirect } from '@sveltejs/kit'


const adminData = {
  redis: {
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
  },
  database: {
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
}

export const ssr = false;
export const prerender = false;

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const { email, admin } = (locals.user) ? locals.user : { email: null, admin: false }

    if (!email || !admin) {
      redirect(307, '/')
      // console.log('Email or admin not found!')
    }

    await redis.connect()
    const redisKeyTootsBoth = `toots_cached_both`
    const redisKeyDashboard = 'account_dashboard'

    const [dashboardCached, tootsCached] = await Promise.all([
      await redis.get(redisKeyDashboard),
      await redis.get(redisKeyTootsBoth)
    ])

    // console.log('dashboardCached', dashboardCached)
    // console.log('tootsCached', tootsCached)

    if (dashboardCached) {
      adminData.redis = JSON.parse(dashboardCached)
    }

    if (tootsCached) {
      adminData.redis.toots = JSON.parse(tootsCached)
    }

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

    // console.log('accounts', JSON.stringify(accounts, null, 2))
    // console.log('counts', JSON.stringify(counts, null, 2))
    // console.log('domains', JSON.stringify(domains, null, 2))
    // console.log('languages', JSON.stringify(languages, null, 2))
    // console.log('tags', JSON.stringify(tags, null, 2))
    // console.log('toots', JSON.stringify(toots, null, 2))

    try {
      // Sum up the count to the time period
      summarizedCounts = summarizeCounts({ documents: counts, hours })
    } catch (error) {
      console.error('Error summarizing counts in main page.ts', error)
    }

    adminData.database.counts = summarizedCounts

    adminData.database.latestCounts.accounts = convertToK(accounts)
    adminData.database.latestCounts.domains = convertToK(domains)
    adminData.database.latestCounts.languages = convertToK(languages)
    adminData.database.latestCounts.tags = convertToK(tags)
    adminData.database.latestCounts.toots = convertToK(toots)

    // console.log('admin', JSON.stringify(admin, null, 2))
    return {
      adminUser: locals.user,
      adminData
    };
  } catch (error) {
    console.error(`Error in (admin) +page.server.ts ${error}`, JSON.stringify(error))
  } finally {
    await redis.disconnect()
  }
}