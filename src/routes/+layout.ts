import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { loadTranslations } from '$lib/translations';
import { getLanguage } from '$lib'
import { auth, initializeFirebase } from '$lib/firebase/client';
import { onAuthStateChanged } from 'firebase/auth';

export const prerender = false
export const ssr = false

export const load: LayoutLoad = async ({ url, data }) => {

  const { pathname } = url;
  const initLocale = getInitialLocale();

  await loadTranslations(initLocale, pathname);

  if (browser) {
    try {
      initializeFirebase();
    } catch (error) {
      console.error('Error initializing firebase', error);
    }
  }

  function getAuthUser() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => resolve(user ? user : false));
    });
  }

  return {
    locale: initLocale,
    route: pathname,
    ...data,
    getAuthUser: getAuthUser
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
  return 'en';
}
