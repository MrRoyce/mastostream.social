import admin from 'firebase-admin';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {

  const { backblazeURL, uid } = await request.json();
  try {

    const fbData = { backblazeURL }
    const db = admin.firestore();
    const docRef = db.collection('users').doc(uid);
    await docRef.update(fbData);

    return json({ status: 'signedIn' });
  } catch (e) {
    console.error(`Error uploading picture to  backblazeURL: ${backblazeURL}`, e)
    error(500, `Error uploading picture to  backblazeURL: ${backblazeURL}`);
  }
};