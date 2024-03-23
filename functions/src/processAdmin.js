import { logger } from 'firebase-functions';
import admin from 'firebase-admin';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

let errorData;
const db = admin.firestore();

export const processAdmin = onCall(async (request) => {
	try {
		console.log('request.data', request.data);
		const { ref, task } = request.data;

		let requestRef;

		if (!ref || !task) {
			errorData = `Entity and task are required`;
			logger.error(errorData);
			throw new HttpsError('unknown', JSON.stringify(errorData));
		}

		const { collection, collectionId, subCollection, subCollectionId } = ref;

		switch (task) {
			case 'delete':
				if (collection && collectionId && subCollection && subCollectionId) {
					requestRef = db.doc(`${collection}/${collectionId}/${subCollection}/${subCollectionId}`);
				} else if (collection && collectionId) {
					requestRef = db.doc(`${collection}/${collectionId}`);
				} else {
					errorData = `Invalid combination of ref paremeters: ${collection}/${collectionId}/${subCollection}/${subCollectionId}`;
					logger.error(errorData);
					throw new HttpsError('unknown', JSON.stringify(errorData));
				}

				await requestRef.delete();

				break;

			default:
				errorData = `Invalid task ${task}`;
				logger.error(errorData);
				throw new HttpsError('unknown', JSON.stringify(errorData));
		}
	} catch (error) {
		throw new HttpsError('internal', JSON.stringify(`${error.message}.`));
	}

	return { status: 'success' };
});
