export async function load({ locals }) {

  return {
    user: locals.user || { email: '', admin: false }
  }

}