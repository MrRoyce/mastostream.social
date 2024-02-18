import { logger } from 'firebase-functions';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const db = admin.firestore();
const timestamp = FieldValue.serverTimestamp();

export const addTags = async ({ toot, tags }) => {
	const { language, tootId } = toot;
	tags.forEach(async (tag) => {
		await db
			.collection(`tags`)
			.doc(`${tag.name}`)
			.set({ language, name: tag.name, timestamp })
			.catch(async (err) => {
				const error = `Failed to add tag: ${tag}, ${err.message}`;
				logger.error(error);
				throw new Error(error);
			});

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
