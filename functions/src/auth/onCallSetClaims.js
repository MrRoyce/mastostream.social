import { onCall } from 'firebase-functions/v2/https';
import admin from 'firebase-admin';
import { logger } from 'firebase-functions';

const admins = ['royceclrw@gmail.com'];

// https://www.youtube.com/watch?v=4wa3CMK4E2Y

export const isUserAdmin = onCall((request) => {
  // get user and add custom claim (admin)
  const email = request.data?.email || 'no_email_found@example.com';
  return admin
    .auth()
    .getUserByEmail(email)
    .then((user) => {
      const isAdmin = admins.includes(user.email || '') ? true : false;
      logger.info(`${email} is ${isAdmin ? '' : 'not'} an admin.`);
      admin.auth().setCustomUserClaims(user.uid, {
        admin: isAdmin
      });
      return {
        admin: isAdmin
      };
    })
    .catch((error) => {
      logger.error(
        `An error occurred getting the user by id ${
          email || 'No email found!'
        }`,
        error
      );
      return error; // TODO send error email
    });
});
