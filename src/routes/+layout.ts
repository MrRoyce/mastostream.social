import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { loadTranslations } from '$lib/translations';
import { getLanguage } from '$lib'

export const load: LayoutLoad = async ({ url, data }) => {
  const { pathname } = url;
  const initLocale = getInitialLocale();

  await loadTranslations(initLocale, pathname);

  return {
    locale: initLocale,
    route: pathname,
    ...(typeof data === 'object' ? data : {}),
    user: data.user
  };
};

function getInitialLocale(): string {
  if (browser) {
    try {
      let language
      // Try to get it from localStorage
      language = getLanguage()
      if (!language) {
        // Get it from the default broswer langauge
        language = window.navigator.language.split('-')[0]
      }
      return language;
    }
    catch (e) {
      console.warn('Error getting initial locale', e)
      return 'en';
    }
  }
  console.log('Returning english')
  return 'en';
}
