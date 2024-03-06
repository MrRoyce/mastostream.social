import { logger } from 'firebase-functions';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const db = admin.firestore();
const timestamp = FieldValue.serverTimestamp();

export const addDomainToCollection = async ({ domain, instance }) => {
	const lowerCase = domain && typeof domain === 'string' ? domain.toLowerCase() : domain;
	await db
		.collection('domains')
		.doc(lowerCase)
		.set({ count: 0, domain, instance, timestamp })
		.catch(async (err) => {
			const error = `Failed to add domain: ${domain}, lowerCase: ${lowerCase}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};

export const updateDomain = async ({ domain }) => {
	const lowerCase = domain && typeof domain === 'string' ? domain.toLowerCase() : domain;
	await db
		.collection('domains')
		.doc(lowerCase)
		.update({ count: FieldValue.increment(1), lastSeen: timestamp }) // Update the count
		.catch(async (err) => {
			const error = `Failed to update Domain: ${domain}, lowerCase ${lowerCase}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};

export const addTootToDomain = async ({ domain, toot, tootId }) => {
	const lowerCase = domain && typeof domain === 'string' ? domain.toLowerCase() : domain;
	await db
		.collection(`domains/${lowerCase}/toots`)
		.doc(tootId)
		.set(toot)
		.catch(async (err) => {
			const error = `Failed to add tootId: ${tootId} to domain ${domain}, lowerCase: ${lowerCase}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};

export const addAccountToDomain = async ({ acct, account, domain }) => {
	const lowerCase = domain && typeof domain === 'string' ? domain.toLowerCase() : domain;
	const lowerCaseAcct = acct && typeof acct === 'string' ? acct.toLowerCase() : acct;
	await db
		.collection(`domains/${lowerCase}/accounts`)
		.doc(lowerCaseAcct)
		.set(account)
		.catch(async (err) => {
			const error = `Failed to add acct: ${acct}, lowerCaseAcct: ${lowerCaseAcct} to domain: ${domain}, lowerCase: ${lowerCase}: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});
};
