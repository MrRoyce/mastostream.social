import { getAuth } from 'firebase-admin/auth';
import type { App } from 'firebase-admin/app';
import { getApp, getApps } from 'firebase-admin/app';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { FB_CLIENT_EMAIL, FB_PRIVATE_KEY, FB_PROJECT_ID, VITE_APIKEY, VITE_DATABASE_URL } from '$env/static/private'
import pkg from 'firebase-admin';

const apiKey = VITE_APIKEY
const clientEmail = FB_CLIENT_EMAIL
const privateKey = FB_PRIVATE_KEY.replace(/\\n/gm, "\n")
const projectId = FB_PROJECT_ID
// const databaseURL = VITE_DATABASE_URL

if (!apiKey || !clientEmail || !privateKey || !projectId) {
  throw new Error('Firebase Admin environment variables not set')
}

const adminConfig = {
  credential: pkg.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  }),
  // databaseURL,
  serviceAccountId: FB_CLIENT_EMAIL // Used for analytics
}

try {
  pkg.initializeApp(adminConfig);
} catch (err: any) {
  if (!/already exists/u.test(err.message)) {
    console.error('Firebase Admin Error: ', err.stack)
  }
}

export const getAdminApp = (): App => getApps().length ? getApp() : pkg.initializeApp(adminConfig)

export const createSessionCookie = async (token: string, maxAge: number) => {
  const auth = getAuth(getAdminApp());

  const expiresIn = maxAge * 1000

  try {
    return await auth.createSessionCookie(token, { expiresIn })
  } catch (error) {
    return null;
  }

};

export const createSessionCookieForUserId = async (
  userId: string,
  maxAge: number
) => {
  const auth = getAuth(getAdminApp());

  const customToken = await auth.createCustomToken(userId, {});

  const firebaseIdToken = await fetch(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${apiKey}`,
    {
      method: 'POST',
      body: JSON.stringify({ token: customToken, returnSecureToken: true }),
    }
  )
    .then((res) => {
      return res.json()
    })
    .then((res) => {
      return res.idToken
    });

  return createSessionCookie(firebaseIdToken, maxAge);
};

export const verifyIdToken = (token: string): Promise<DecodedIdToken> => {
  const auth = getAuth(getAdminApp());
  return auth.verifyIdToken(token);
};

export const getIdTokenFromSessionCookie = async (
  sessionCookie: string | null
): Promise<DecodedIdToken | null> => {
  if (!sessionCookie) return null;

  const auth = getAuth(getAdminApp());

  return auth.verifySessionCookie(sessionCookie, true).catch(() => null);
};

export const adminAuth = getAuth();
