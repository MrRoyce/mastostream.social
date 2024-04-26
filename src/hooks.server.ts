import { adminAuth, createSessionCookieForUserId, getIdTokenFromSessionCookie } from "$lib/firebase/admin";
import { redirect, type Cookies, type Handle, type HandleServerError } from "@sveltejs/kit";
import { locale } from '$lib/translations';
import { ONE_DAY_IN_SECONDS, ONE_WEEK_IN_SECONDS } from '$lib/constants';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { functions } from "$lib/firebase/client";
import { httpsCallable } from 'firebase/functions';
import { dev } from "$app/environment";
import { VITE_VALID_DOMAIN } from '$env/static/private'
import { error } from '@sveltejs/kit';

const SIX_DAYS_IN_SECONDS = ONE_DAY_IN_SECONDS * 6;

const instance = httpsCallable(functions, 'isUserAdmin');

export const handle: Handle = (async ({ event, resolve }) => {

  if (event.request.url.length > 200) {
    console.warn('Url exceeeds maximum length', event.request.url)
    throw redirect(307, '/')
  }

  const validDomain = VITE_VALID_DOMAIN
  const referer = event.request.headers.get('referer')

  if (!referer?.startsWith(validDomain)) {
    console.error(`Invalid domain request prohibited' validDomain: ${validDomain}, referer: ${referer}, for url: ${event.request.url}`)
    error(403, {
      message: 'Forbidden'
    });
  } else {
    console.log(`Valid domain check validDomain: ${validDomain}, referer: ${referer}, for url: ${event.request.url}`)
  }

  const sessionCookie = event.cookies.get("__session");
  const lang = event.request.headers.get('accept-language')?.split(',')[0];

  let isUserAdmin

  if (lang) {
    locale.set(lang);
  } else {
    locale.set('en');
  }

  try {
    if (sessionCookie) {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);

      let response

      try {
        response = await instance({ email: decodedClaims.email || '' })

        if (!response.data) {
          throw new Error(`Failed to call isUserAdmin cloud function. Status: ${response.status || false}`);
        }
      } catch (error) {
        const { code, details } = JSON.parse(JSON.stringify(error))
        throw new Error(`Error in calling isUserAdmin cloud function. Code: ${code}, Details: ${details}`);
      }

      const data = response.data;
      const admin = Boolean(data.admin);
      isUserAdmin = admin

      const user = {
        admin,
        displayName: decodedClaims.name || '',
        email: decodedClaims.email || '',
        picture: decodedClaims.picture || '',
        uid: decodedClaims.uid || '',
      }

      event.locals.user = user;

      const token = await getIdTokenFromSessionCookie(
        sessionCookie
      );

      if (token && shouldRefreshToken(token)) {
        await updateSessionCookie(token, event.cookies);
      }

    } else {
      event.locals.user = { admin: false, displayName: '', email: '', picture: '', uid: '' }
    }
  } catch (e) {
    console.error('Could not get idToken from session cookie - e:', e)
  }

  // Only allow admin in dev and for admin users!
  if (!dev || !isUserAdmin) {
    if (event.url.pathname.includes('/admin')) {
      throw redirect(303, '/')
    }
  }

  return resolve(event);
});

const shouldRefreshToken = (token: DecodedIdToken | null) =>
  token && token.exp - Date.now() / 1000 < SIX_DAYS_IN_SECONDS;

async function updateSessionCookie(token: DecodedIdToken, cookies: Cookies) {

  const freshSessionCookie = await createSessionCookieForUserId(
    token.uid,
    ONE_WEEK_IN_SECONDS
  );

  if (freshSessionCookie) {
    cookies.set('__session', freshSessionCookie, {
      httpOnly: true,
      maxAge: ONE_WEEK_IN_SECONDS,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  } else {
    console.error('Did not get updatedSessionCookie!!')
  }
}

export const handleError: HandleServerError = ({ error }) => {
  const message = ' Error caught in [server-hooks]: ' + (error as any)?.message;
  return {
    message,
    errorId: '404'
  };

};
