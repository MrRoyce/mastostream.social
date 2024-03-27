import type { PageServerLoad } from './$types';
import { validateToken } from '$lib/utils'


export const load: PageServerLoad = (async () => {
  return {};
})

export const actions = {
  validateTurnstile: async ({ request }) => {
    try {
      const data = await request.formData()
      const token = data.get('cf-turnstile-response')
      console.log('validateToken: token from cloudflare turnstile', token)

      const turnstileKey = import.meta.env.VITE_SECRET_TURNSTILE_KEY

      const { success, error } = await validateToken(token, turnstileKey)
      console.log('success', success)
      console.log('error', error)
      if (error) {
        throw new Error(`Error - did not validate turnstile token ${error}`);
      }
      return { success: true }
    } catch (error) {
      console.log('error in registration', error)
      return {
        success: false, error: {
          ...JSON.parse(JSON.stringify(error))
        }
      }
    }
  }
}