/* eslint-disable operator-linebreak */
/* eslint-disable quotes */
import admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';

const db = admin.firestore();

function getStartAndEndOfPreviousHour() {
	const now = admin.firestore.Timestamp.now().toDate();
	const startOfPreviousHour = new Date(now);
	startOfPreviousHour.setMinutes(0, 0, 0); // Reset minutes and seconds
	startOfPreviousHour.setHours(startOfPreviousHour.getHours() - 1); // Go back one hour

	const endOfPreviousHour = new Date(startOfPreviousHour);
	endOfPreviousHour.setHours(endOfPreviousHour.getHours() + 1); // Go forward one hour to get the end of the previous hour

	return {
		startOfPreviousHour: admin.firestore.Timestamp.fromDate(startOfPreviousHour),
		endOfPreviousHour: admin.firestore.Timestamp.fromDate(endOfPreviousHour)
	};
}

async function getCollectionCounts({ collection, startOfPreviousHour, endOfPreviousHour, field }) {
	const snapshot = await db
		.collection(collection)
		.where(field, '>', startOfPreviousHour)
		.where(field, '<', endOfPreviousHour)
		.count()
		.get()
		.catch(async (error) => {
			logger.error('Error getting count of accounts', JSON.stringify(error));
			return 0;
		});

	return snapshot.data().count;
}

async function storeCount({ collection, count, timestamp }) {
	await db
		.collection('timeseries')
		.add({ collection, count, timestamp })
		.catch(async (error) => {
			logger.error(`Error storing count to ${collection}`, JSON.stringify(error));
		});
}

export const getCounts = onSchedule('1 * * * *', async () => {
	const { startOfPreviousHour, endOfPreviousHour } = getStartAndEndOfPreviousHour();

	const timestamp = admin.firestore.FieldValue.serverTimestamp();

	const accountsCount = await getCollectionCounts({
		collection: 'accounts',
		startOfPreviousHour,
		endOfPreviousHour,
		field: 'timestamp'
	});
	await storeCount({ collection: 'accounts', count: accountsCount, timestamp });

	const domainsCount = await getCollectionCounts({
		collection: 'domains',
		startOfPreviousHour,
		endOfPreviousHour,
		field: 'timestamp'
	});
	await storeCount({ collection: 'domains', count: domainsCount, timestamp });

	const languagesCount = await getCollectionCounts({
		collection: 'languages',
		startOfPreviousHour,
		endOfPreviousHour,
		field: 'timestamp'
	});
	await storeCount({ collection: 'languages', count: languagesCount, timestamp });

	const tagsCount = await getCollectionCounts({
		collection: 'tags',
		startOfPreviousHour,
		endOfPreviousHour,
		field: 'timestamp'
	});
	await storeCount({ collection: 'tags', count: tagsCount, timestamp });

	const tootsCount = await getCollectionCounts({
		collection: 'toots',
		startOfPreviousHour,
		endOfPreviousHour,
		field: 'timestamp'
	});
	await storeCount({ collection: 'toots', count: tootsCount, timestamp });
});
