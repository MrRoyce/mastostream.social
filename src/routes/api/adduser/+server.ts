import admin from 'firebase-admin';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logger } from 'firebase-functions/v2';

export const POST: RequestHandler = async ({ request }) => {

  try {
    const { displayName, email, photoURL, uid } = await request.json();

    const db = admin.firestore();
    const docRef = db.collection('users').doc(uid);
    await docRef.set({
      email,
      displayName,
      photoURL
    });

    const msg = {
      to: email,
      template: {
        name: 'newUserTemplate',
        data: {
          appName: 'Utoots',
          domainName: 'utoots.com',
          function: 'Send customer email - new user welcome',
          subject: 'Thanks for joining utoots.com!'
        }

      }
    }

    await admin
      .firestore()
      .collection('mail')
      .add(msg)
      .then(() => {
        return null;
      })
      .catch((error) => {
        logger.error(`Failed to add record to mail collection - error ${error}`);
        throw new Error(
          `Failed adding document to mail collection. mail_template: ${mail_template}, data: ${JSON.parse(
            { ...data }
          )}`
        );
      });

    return json({ status: 'User added' });
  } catch (e) {
    console.error(`Error adding user`, e)
    error(500, `Error adding user`);
  }
};