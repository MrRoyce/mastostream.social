const emailJSUri = 'https://api.emailjs.com/api/v1.0/email/send'

export const actions = {
  sendMessage: async ({ request, fetch }) => {
    try {
      const formData = await request.formData()
      const payload = {
        service_id: 'service_ed66o1a',
        template_id: 'template_kp3rq3r',
        user_id: 'd7wo1Pasxle7aNu86',
        template_params: {
          name: String(formData.get('name')),
          email: String(formData.get('email')),
          message: String(formData.get('message')),
        }
      }
      const rawResponse = await fetch(emailJSUri, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      const content = await rawResponse.json()

      console.log('content', content)
      return { success: true, data: { ...JSON.parse(JSON.stringify(content)) } }
    } catch (error) {
      return {
        success: false, error: { ...JSON.parse(JSON.stringify(error)) }
      }
    }
  }
};