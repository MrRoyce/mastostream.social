import { logger } from 'firebase-functions';
import admin from 'firebase-admin';

const db = admin.firestore();

async function addRepliesToOriginalToot({ currentToot, currentId }) {
	const { inReplyToAccountId, inReplyToId } = currentToot;
	const originalId = `${inReplyToAccountId}_${inReplyToId}`;

	// Add the replies to the original toot
	if (inReplyToAccountId && inReplyToId) {
		// Get reference to the original toot
		const originalTootRef = db.collection('toots').doc(originalId);

		// Now update the replies for the original toot with current toot id
		try {
			await originalTootRef.update({ replies: admin.firestore.FieldValue.arrayUnion(currentId) });
			logger.log(`Success updating replies array for toots originalId ${originalId}.`);
		} catch (error) {
			// If it failed, try to set the values
			logger.warn(`Attempting to add replies array for toots originalId ${originalId}...`);

			try {
				await db
					.collection(`toots`)
					.doc(originalId)
					.set({ replies: [currentId] });
				logger.log(`Success adding replies array for toots originalId ${originalId}.`);
			} catch (error) {
				logger.warn(`Error caught adding replies array for toots originalId ${originalId}.`);
			}
		}
	} else {
		logger.log(
			`addRepliesToOriginalToot not processd for originalId: ${originalId}, inReplyToAccountId: ${inReplyToAccountId}, inReplyToId: ${inReplyToId}.`
		);
	}
}

export const addToot = async (toot) => {
	const currentId = `${toot.accountId}_${toot.tootId}`;

	// Check to see if this is a reply to a previous toot
	await addRepliesToOriginalToot({ currentToot: toot, currentId });

	const response = await db
		.collection('toots')
		.doc(currentId)
		.set({ ...toot, replies: [] }) //Initialize replies array
		.catch(async (err) => {
			const error = `Failed to add toot: ${err.message}`;
			logger.error(error);
			throw new Error(error);
		});

	return response;
};
