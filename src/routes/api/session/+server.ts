import { json, type RequestHandler } from '@sveltejs/kit'
import { createSessionCookie, verifyIdToken } from '$lib/firebase/admin'
import { ONE_WEEK_IN_SECONDS } from '$lib/constants'

// POST /auth/session
export const POST: RequestHandler = async ({ request, cookies }) => {
  const authHeader = request.headers.get('Authorization') || ''
  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return { status: 401, body: 'Invalid authorization header' }
  }

  try {
    const { auth_time } = await verifyIdToken(token)

    // Additional security check
    if (new Date().getTime() / 1000 - auth_time < 5 * 60) {

      const cookie = await createSessionCookie(token, ONE_WEEK_IN_SECONDS)

      const options = {
        httpOnly: true,
        maxAge: ONE_WEEK_IN_SECONDS,
        path: '/',
        sameSite: 'strict',
        secure: true,
      };

      // Use sveltekit to set cookie in the application
      // Firebase will cache cookies with the name __session on its cdn
      cookies.set('__session', cookie || '', options);

      return json({ status: 'signedIn' });

    } else {
      return { status: 401, body: 'Invalid authorization header - Recent sign up required' }
    }
  } catch {
    return { status: 401, body: 'invalid token' }
  }
}

const expiredCookie = 'session=; SameSite=Strict; Path=/; HttpOnly; Max-Age=0;'

export const DELETE: RequestHandler = () => {
  return {
    status: 200,
    headers: {
      'Set-Cookie': expiredCookie,
    },
  }
}