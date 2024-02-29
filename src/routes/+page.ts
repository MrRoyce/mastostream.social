import type { PageLoad } from './$types';
import { getCount, getCounts } from '$lib/getCollection';
import { summarizeCounts } from '$lib/utils/summarizeCounts';
import { convertToK } from '$lib/utils/convertToK';

export const ssr = false;
export const prerender = false;

export const load: PageLoad = async ({ data }) => {


  const hours = 6
  let summarizedCounts

  const [accounts, counts, domains, languages, tags, toots] = await Promise.all([
    await getCount('accounts'),
    await getCounts(hours),
    await getCount('domains'),
    await getCount('languages'),
    await getCount('tags'),
    await getCount('toots')
  ])

  try {
    // Sum up the count to the time period
    summarizedCounts = summarizeCounts({ documents: counts, hours: 6 })
  } catch (error) {
    console.error('Error summarizing counts in main page.ts', error)
  }

  return {
    accounts: convertToK(accounts),
    counts: summarizedCounts,
    domains: convertToK(domains),
    languages: convertToK(languages),
    tags: convertToK(tags),
    toots: convertToK(toots)
  };
};
