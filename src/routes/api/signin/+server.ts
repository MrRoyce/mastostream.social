import { getAdminApp } from '$lib/firebase/admin';
import { getAuth } from 'firebase-admin/auth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ONE_WEEK_IN_SECONDS } from '$lib/constants';

// Sign in
export const POST: RequestHandler = async ({ request, cookies }) => {

  // Sign in with google provides an idToken
  // Pass idToken to server
  // Be careful for other login solutions!!
  const { idToken } = await request.json();
  const expiresIn = 60 * 60 * 24 * 5; // 5 days
  const auth = getAuth(getAdminApp());
  // Verify token on server to get access to userdata
  const decodedIdToken = await auth.verifyIdToken(idToken);

  // Additional security check
  if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {

    const cookie = await auth.createSessionCookie(idToken, { expiresIn });

    const options = {
      httpOnly: true,
      maxAge: ONE_WEEK_IN_SECONDS,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    };

    // Use sveltekit to set cookie in the application
    // Firebase will cache cookies with the name __session on its cdn
    cookies.set('__session', cookie, options);

    return json({ status: 'signedIn' });
  } else {
    throw error(401, 'Recent sign in required!');
  }
};

// Sign Out
export const DELETE: RequestHandler = async ({ cookies }) => {
  // Use sveltekit to delete cookie
  cookies.delete('__session', { path: '/' });
  return json({ status: 'signedOut' });
}

