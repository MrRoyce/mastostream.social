export async function load({ locals }) {
  return {
    user: locals.user && {
      admin: locals.user.admin,
      displayName: locals.user.displayName,
      email: locals.user.email,
      picture: locals.user.picture,
      uid: locals.user.uid
    }
  };
}