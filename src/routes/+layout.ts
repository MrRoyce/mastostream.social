import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { loadTranslations } from '$lib/translations';

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
      return window.navigator.language.split('-')[0];
    }
    catch (e) {
      console.warn('Error getting initial locale', e)
      return 'en';
    }
  }

  return 'en';
}
