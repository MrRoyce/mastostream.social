import { logger } from 'firebase-functions';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const db = admin.firestore();
const timestamp = FieldValue.serverTimestamp();

export const addAccount = async ({ account, acct }) => {
	const lowerCase = acct && typeof acct === 'string' ? acct.toLowerCase() : acct;
	await db
		.collection('accounts')
		.doc(lowerCase)
		.set({ ...account, timestamp })
		.catch(async (err) => {
			const error = `Failed to add account: ${acct}, lowerCase: ${lowerCase} ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};

export const addTootToAccount = async ({ acct, toot, tootId }) => {
	const lowerCase = acct && typeof acct === 'string' ? acct.toLowerCase() : acct;
	// Update the timestamp
	await db
		.collection('accounts')
		.doc(lowerCase)
		.update({ timestamp })
		.catch(async (err) => {
			const error = `Failed to update account: ${acct}, lowerCase:  ${lowerCase}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});

	await db
		.collection(`accounts/${lowerCase}/toots`)
		.doc(tootId)
		.set(toot)
		.catch(async (err) => {
			const error = `Failed to add tootId: ${tootId} to account ${acct}, lowerCase: ${lowerCase}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};
