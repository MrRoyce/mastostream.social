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
		// First check if tag exists
		const tagDoc = db.doc(`tags/${tag.name}`);
		const tagSnapshot = await tagDoc.get();
		if (!tagSnapshot.exists) {
			// add it with count 1
			await db
				.collection(`tags`)
				.doc(`${tag.name}`)
				.set({ count: 1, name: tag.name, timestamp, lastSeen: timestamp })
				.catch(async (err) => {
					const error = `Failed to add tag: ${tag}, ${err.message}`;
					logger.error(error);
					throw new Error(error);
				});
		} else {
			// update the count
			await db
				.collection(`tags`)
				.doc(`${tag.name}`)
				.update({ count: FieldValue.increment(1), lastSeen: timestamp })
				.catch(async (err) => {
					const error = `Failed to update tag: ${tag}, ${err.message}`;
					logger.error(error);
					throw new Error(error);
				});
		}

		await db
			.collection(`tags/${tag.name}/toots`)
			.doc(`${tootId}`)
			.set(toot)
			.catch(async (err) => {
				const error = `Failed to add tag: ${tag} to tootId: ${tootId}, ${err.message}`;
				logger.error(error);
				throw new Error(error);
			});
	});
};
