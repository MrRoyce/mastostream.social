import admin from 'firebase-admin';
import { error, json } from '@sveltejs/kit';
import { redis } from '$lib/redis/redis';
import type { RequestHandler } from './$types';

const ttl = 60 * 60 * 24 * 365 // Cache pictures for one year

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

export const GET: RequestHandler = async ({ url }) => {
  const uid = url.searchParams.get('uid')
  const redisPictureURL = `user_picture_url_${uid}`
  const userPictureURLCached = await redis.get(redisPictureURL)

  let pictureURL = ''

  const checkCache = true  // TODO always check this!

  if (userPictureURLCached && checkCache) {
    return {
      pictureURL: JSON.parse(userPictureURLCached)
    }
  } else {
    // Get the user document from the database
    const db = admin.firestore();
    const userRef = db.doc(`users/${uid}`)
    const userSnap = await userRef.get()

    if (userSnap.exists) {
      const userData = userSnap.data()

      if (userData) {
        if (userData.backblazeURL) {
          pictureURL = userData.backblazeURL;
        } else if (userData.picture) {
          pictureURL = userData.picture;
        } else {
          pictureURL = userData.photoURL || '';
        }

        // Store account entity in redis
        if (pictureURL) {
          await redis.set(redisPictureURL, JSON.stringify(pictureURL), 'EX', ttl)

          // Return the pictureURL
          return new Response(JSON.stringify({ pictureURL }), { status: 200 })

        } else {
          // No picture, return empty string
          return new Response(JSON.stringify({ pictureURL: '' }), { status: 200 })
        }
      } else {
        console.warn(`UserData not found in snapshot not found for user: ${uid}`)
        return new Response(JSON.stringify({ status: 'failed' }), { status: 500 })
      }
    } else {
      console.warn(`UserData snapshot not found for user: ${uid}`)
      return new Response(JSON.stringify({ status: 'failed' }), { status: 500 })
    }
  }
}