import { logger } from 'firebase-functions';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const db = admin.firestore();
const timestamp = FieldValue.serverTimestamp();

export const addDomainToCollection = async ({ domain, instance }) => {
	await db
		.collection('domains')
		.doc(`${domain}`)
		.set({ count: 0, domain, instance, timestamp })
		.catch(async (err) => {
			const error = `Failed to add domain: ${domain}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};

export const updateDomain = async ({ domain }) => {
	await db
		.collection('domains')
		.doc(`${domain}`)
		.update({ count: FieldValue.increment(1) }) // Update the count
		.catch(async (err) => {
			const error = `Failed to update Domain: ${domain}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};

export const addTootToDomain = async ({ domain, toot, tootId }) => {
	await db
		.collection(`domains/${domain}/toots`)
		.doc(`${tootId}`)
		.set(toot)
		.catch(async (err) => {
			const error = `Failed to add tootId: ${tootId} to domain ${domain}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};

export const addAccountToDomain = async ({ acct, account, domain }) => {
	await db
		.collection(`domains/${domain}/accounts`)
		.doc(`${acct}`)
		.set(account)
		.catch(async (err) => {
			const error = `Failed to add acct: ${acct} to domain ${domain}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};
