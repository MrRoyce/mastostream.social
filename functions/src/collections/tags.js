import { logger } from 'firebase-functions';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const db = admin.firestore();
const timestamp = FieldValue.serverTimestamp();

// This will update the timestamp to the latest time
// that the tag was seen!
export const addTags = async ({ tags, toot }) => {
	const { tootId } = toot;
	tags.forEach(async (tag) => {
		const lowerCase = tag.name && typeof tag.name === 'string' ? tag.name.toLowerCase() : tag.name;

		// First check if tag exists
		const tagDoc = db.doc(`tags/${lowerCase}`);
		const tagSnapshot = await tagDoc.get();
		if (!tagSnapshot.exists) {
			// add it with count 1
			await db
				.collection(`tags`)
				.doc(`${lowerCase}`)
				.set({ count: 1, name: tag.name, timestamp, lastSeen: timestamp })
				.catch(async (err) => {
					const error = `Failed to add tag: ${tag.name}, lowerCase: ${lowerCase}, ${err.message}`;
					logger.error(error);
					throw new Error(error);
				});
		} else {
			// update the count
			await db
				.collection(`tags`)
				.doc(`${lowerCase}`)
				.update({ count: FieldValue.increment(1), lastSeen: timestamp })
				.catch(async (err) => {
					const error = `Failed to update tag: ${tag.name}, lowerCase: ${lowerCase}, ${err.message}`;
					logger.error(error);
					throw new Error(error);
				});
		}

		await db
			.collection(`tags/${lowerCase}/toots`)
			.doc(`${tootId}`)
			.set(toot)
			.catch(async (err) => {
				const error = `Failed to add tag: ${tag}, lowerCase: ${lowerCase} to tootId: ${tootId}, ${err.message}`;
				logger.error(error);
				throw new Error(error);
			});
	});
};
