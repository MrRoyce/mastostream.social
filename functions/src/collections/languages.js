import { logger } from 'firebase-functions';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const db = admin.firestore();
const timestamp = FieldValue.serverTimestamp();

export const addLanguageToCollection = async ({ language }) => {
	const lowerCase = language && typeof language === 'string' ? language.toLowerCase() : language;
	await db
		.collection('languages')
		.doc(lowerCase)
		.set({ count: 0, language, timestamp })
		.catch(async (err) => {
			const error = `Failed to add language: ${language}, lowerCase: ${lowerCase}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};

export const updateLanguage = async ({ language }) => {
	const lowerCase = language && typeof language === 'string' ? language.toLowerCase() : language;
	await db
		.collection('languages')
		.doc(lowerCase)
		.update({ count: FieldValue.increment(1), lastSeen: timestamp }) // Update the count
		.catch(async (err) => {
			const error = `Failed to update Language: ${language}, lowerCase: ${lowerCase}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};

export const addTootToLanguage = async ({ language, toot, tootId }) => {
	const lowerCase = language && typeof language === 'string' ? language.toLowerCase() : language;
	await db
		.collection(`languages/${lowerCase}/toots`)
		.doc(tootId)
		.set(toot)
		.catch(async (err) => {
			const error = `Failed to add tootId: ${tootId} to language ${language}, lowerCase: ${lowerCase}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};
