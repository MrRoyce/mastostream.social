import type { PageLoad } from '../$types';
import { getCount, getCounts, getWords } from '$lib/getCollection';
import { summarizeCounts } from '$lib/utils/summarizeCounts';
import { convertToK } from '$lib/utils/convertToK';
import { getRandomRange } from '$lib/utils/getRandomRange';

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

  const { start } = getRandomRange(tags)
  const [words] = await Promise.all([
    getWords({ start, max: 50 })
  ])

  try {
    // Sum up the count to the time period
    summarizedCounts = summarizeCounts({ documents: counts, hours })
  } catch (error) {
    console.error('Error summarizing counts in main page.ts', error)
  }

  return {
    accounts: convertToK(accounts),
    counts: summarizedCounts,
    domains: convertToK(domains),
    languages: convertToK(languages),
    tags: convertToK(tags),
    toots: convertToK(toots),
    words,
    ...data
  };
};
