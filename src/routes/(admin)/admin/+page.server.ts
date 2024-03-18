import { redirect } from '@sveltejs/kit'

export async function load({ locals }) {

  const { email, admin } = locals.user || { email: '', admin: false }

  if (!email || !admin) {
    throw redirect(307, '/')
  }

  return {
    user: locals.user
  }

}