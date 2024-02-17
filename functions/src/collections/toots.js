import { logger } from 'firebase-functions';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const db = admin.firestore();
const timestamp = FieldValue.serverTimestamp();

export const addToot = async (toot) => {
	const response = await db
		.collection('toots')
		.add(toot)
		.catch(async (err) => {
			const error = `Failed to add toot: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});

	return response;
};
