
interface TokenValidateResponse {
  'error-codes': string[];
  success: boolean;
  action: string;
  cdata: string;
}

async function validateToken(token: string, secret: string) {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        response: token,
        secret: secret,
      }),
    },
  );

  const data: TokenValidateResponse = await response.json();

  return {
    // Return the status
    success: data.success,

    // Return the first error if it exists
    error: data['error-codes']?.length ? data['error-codes'][0] : null,
  };
}

export const actions = {
  sendMessage: async ({ request }) => {
    try {
      const data = await request.formData()
      const token = data.get('cf-turnstile-response')
      console.log('token from cloudflare turnstile', token)

      const turnstileKey = import.meta.env.VITE_SECRET_TURNSTILE_KEY

      const { success, error } = await validateToken(token, turnstileKey)
      console.log('success', success)
      console.log('error', error)
      if (error) {
        throw new Error(`Error - did not validate captchat token ${error}`);
      }
      return { success: true }
    } catch (error) {
      return {
        success: false, error: { ...JSON.parse(JSON.stringify(error)) }
      }
    }
  }
};