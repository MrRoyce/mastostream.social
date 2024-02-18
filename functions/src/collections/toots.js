import { logger } from 'firebase-functions';
import admin from 'firebase-admin';

const db = admin.firestore();

export const addToot = async (toot) => {
	const response = await db
		.collection('toots')
		.doc(`${toot.accountId}_${toot.tootId}`)
		.set(toot)
		.catch(async (err) => {
			const error = `Failed to add toot: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});

	return response;
};
