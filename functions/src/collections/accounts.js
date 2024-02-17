import { logger } from 'firebase-functions';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const db = admin.firestore();
const timestamp = FieldValue.serverTimestamp();

export const addAccount = async ({ account, acct }) => {
	await db
		.collection('accounts')
		.doc(`${acct}`)
		.set({ ...account, timestamp })
		.catch(async (err) => {
			const error = `Failed to add account: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};

export const addTootToAccount = async ({ acct, toot, tootId }) => {
	await db
		.collection(`accounts/${acct}/toots`)
		.doc(`${tootId}`)
		.set(toot)
		.catch(async (err) => {
			const error = `Failed to add tootId: ${tootId} to account ${acct}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};
