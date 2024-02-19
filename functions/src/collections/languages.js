import { logger } from 'firebase-functions';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const db = admin.firestore();
const timestamp = FieldValue.serverTimestamp();

export const addLanguageToCollection = async ({ language }) => {
	await db
		.collection('languages')
		.doc(`${language}`)
		.set({ count: 0, language, timestamp })
		.catch(async (err) => {
			const error = `Failed to add language: ${language}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};

export const updateLanguage = async ({ language }) => {
	await db
		.collection('languages')
		.doc(`${language}`)
		.update({ count: FieldValue.increment(1), lastSeen: timestamp }) // Update the count
		.catch(async (err) => {
			const error = `Failed to update Language: ${language}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};

export const addTootToLanguage = async ({ language, toot, tootId }) => {
	await db
		.collection(`languages/${language}/toots`)
		.doc(`${tootId}`)
		.set(toot)
		.catch(async (err) => {
			const error = `Failed to add tootId: ${tootId} to language ${language}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};
