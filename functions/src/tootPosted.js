import { initializeApp } from 'firebase-admin/app';
initializeApp();
import express from 'express';
import { body, validationResult } from 'express-validator';
import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const app = express();
app.use(express.json());

const siteCreationValidators = [
	body('accountId').notEmpty(),
	body('content').notEmpty(),
	body('createdAt').notEmpty(),
	body('tootId').notEmpty(),
	body('uri').notEmpty()
];

app.post('/tootposted', siteCreationValidators, async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		logger.error('Missing required fields', JSON.stringify(errors));
		return res.status(400).json({ errors: 'Invalid input' });
	}

	const {
		account,
		accountId,
		addLanguage,
		content,
		createdAt,
		imageUrl,
		language,
		previewUrl,
		remoteUrl,
		sensitive,
		tags,
		tootId,
		uri,
		visibility
	} = req.body;

	const db = admin.firestore();

	const thisToot = {
		accountId,
		content,
		createdAt,
		imageUrl: imageUrl || '',
		language,
		previewUrl: previewUrl || '',
		remoteUrl: remoteUrl || '',
		sensitive,
		tootId,
		uri,
		visibility
	};

	const tootsDocument = await db
		.collection('toots')
		.add(thisToot)
		.catch(async (error) => {
			return res.status(400).send({ status: 'error', message: error.message });
		});

	if (tags) {
		const timestamp = FieldValue.serverTimestamp();
		tags.forEach(async (tag) => {
			await db
				.collection(`tags`)
				.doc(`${tag.name}`)
				.set({ language, lastTweetPosted: timestamp })
				.catch(async (error) => {
					return res.status(400).send({ status: 'error', message: error.message });
				});

			await db
				.collection(`tags/${tag.name}/toots`)
				.doc(`${tootId}`)
				.set(thisToot)
				.catch(async (error) => {
					return res.status(400).send({ status: 'error', message: error.message });
				});
		});
	}

	// Add the account to the collection
	if (account) {
		await db
			.collection('accounts')
			.doc(`${account.acct}`)
			.set(account)
			.catch(async (error) => {
				return res.status(400).send({ status: 'error', message: error.message });
			});
	}

	// Add the toot to the list of languages
	if (language) {
		await db
			.collection(`tootsByLanguage/${language}/toots`)
			.doc(`${tootId}`)
			.set(thisToot)
			.catch(async (error) => {
				return res.status(400).send({ status: 'error', message: error.message });
			});
	}

	// Add the language to list of languages
	if (addLanguage && language) {
		await db
			.collection('languages')
			.doc(`${language}`)
			.set({ available: true })
			.catch(async (error) => {
				return res.status(400).send({ status: 'error', message: error.message });
			});
	}

	res.status(200).send({ status: 200, tootsDocumentId: tootsDocument.id });
});

export const tootPosted = onRequest({ cors: true }, app);
