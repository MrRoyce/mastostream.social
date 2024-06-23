import { redis } from '$lib/redis/redis';
import { error, json } from '@sveltejs/kit';
import admin from 'firebase-admin';
import type { RequestHandler } from './$types';

const ttl = 60 * 60 * 24 * 365 // Cache pictures for one year
const redisKeyPictureURLPrefix = 'user:picture'

export const POST: RequestHandler = async ({ request }) => {

  const { backblazeURL, uid } = await request.json();
  try {
    const redisKeyPictureURL = `${redisKeyPictureURLPrefix}:${uid}`
    const fbData = { backblazeURL }
    const db = admin.firestore();
    const docRef = db.collection('users').doc(uid);
    await docRef.update(fbData);

    // Store new url in redis
    await redis.set(redisKeyPictureURL, JSON.stringify({ pictureURL: backblazeURL }), 'EX', ttl)

    return json({ status: 'signedIn' });
  } catch (e) {
    console.error(`Error uploading picture to  backblazeURL: ${backblazeURL}`, e)
    error(500, `Error uploading picture to  backblazeURL: ${backblazeURL}`);
  }
};

export const GET: RequestHandler = async ({ url }) => {
  const uid = url.searchParams.get('uid')
  const redisKeyPictureURL = `${redisKeyPictureURLPrefix}:${uid}`
  const userPictureURLCached = await redis.get(redisKeyPictureURL)

  let pictureURL = ''
  const checkCache = true  // TODO always check this!

  if (userPictureURLCached && checkCache) {
    return new Response(userPictureURLCached, { status: 200 })
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
          await redis.set(redisKeyPictureURL, JSON.stringify({ pictureURL }), 'EX', ttl)

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