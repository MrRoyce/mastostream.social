import { validateToken } from '$lib/utils'

export const actions = {
  sendMessage: async ({ request }) => {
    try {
      const data = await request.formData()
      const token = data.get('cf-turnstile-response')
      const turnstileKey = import.meta.env.VITE_SECRET_TURNSTILE_KEY

      const { success, error } = await validateToken(token, turnstileKey)
      if (error) {
        throw new Error(`Error - did not validate turnstile token ${error}`);
      }

      return { success: true }
    } catch (error) {
      return {
        success: false, error: { ...JSON.parse(JSON.stringify(error)) }
      }
    }
  }
};