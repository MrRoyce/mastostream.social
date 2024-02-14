import type { PageLoad } from './$types';
import { getCount } from '$lib/getCollection';

export const ssr = false;
export const prerender = false;

export const load: PageLoad = async ({ data }) => {

  let accounts;
  let languages;
  let tags;
  let toots;
  let tootsByLanguage;

  function convertToK(number) {
    if (typeof number !== 'number') {
      return 0;
    }

    if (number <= 1000) {
      return number;
    }

    const kValue = Math.round(number / 1000 * 10) / 10;
    return kValue + 'k';

  }

  try {
    accounts = await getCount('accounts');
    languages = await getCount('languages');
    tags = await getCount('tags');
    toots = await getCount('toots');
    tootsByLanguage = await getCount('tootsByLanguage');

  } catch (error) {
    console.error('Error in main page.ts', error)
  }

  return {
    accounts: convertToK(accounts),
    languages: convertToK(languages),
    tags: convertToK(tags),
    toots: convertToK(toots),
    tootsByLanguage: convertToK(tootsByLanguage),
    ...data
  };
};
