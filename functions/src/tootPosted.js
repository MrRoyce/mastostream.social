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
		return res.status(500).json({ errors: 'Invalid input' });
	}

	const {
		account,
		acct,
		accountId,
		addLanguage,
		content,
		createdAt,
		domain,
		addDomain,
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
	const timestamp = FieldValue.serverTimestamp();

	const thisToot = {
		acct,
		accountId,
		content,
		createdAt,
		imageUrl: imageUrl || '',
		language,
		previewUrl: previewUrl || '',
		remoteUrl: remoteUrl || '',
		sensitive,
		timestamp,
		tootId,
		uri,
		visibility
	};

	const tootsDocument = await db
		.collection('toots')
		.add(thisToot)
		.catch(async (error) => {
			return res.status(500).send({ status: 'error', message: error.message });
		});

	if (tags) {
		tags.forEach(async (tag) => {
			await db
				.collection(`tags`)
				.doc(`${tag.name}`)
				.set({ language, timestamp })
				.catch(async (error) => {
					return res.status(500).send({ status: 'error', message: error.message });
				});

			await db
				.collection(`tags/${tag.name}/toots`)
				.doc(`${tootId}`)
				.set(thisToot)
				.catch(async (error) => {
					return res.status(500).send({ status: 'error', message: error.message });
				});
		});
	}

	// Add the account to the collection
	if (account) {
		await db
			.collection('accounts')
			.doc(`${acct}`)
			.set({ ...account, timestamp })
			.catch(async (error) => {
				return res.status(500).send({ status: 'error', message: error.message });
			});
	}

	// Add the toot to the account
	await db
		.collection(`accounts/${acct}/toots`)
		.doc(`${tootId}`)
		.set(thisToot)
		.catch(async (error) => {
			return res.status(500).send({ status: 'error', message: error.message });
		});

	// Add the domain to the collection
	if (addDomain) {
		await db
			.collection('domains')
			.doc(`${domain}`)
			.set({ count: 0, createdAt: timestamp, timestamp })
			.catch(async (error) => {
				return res.status(500).send({ status: 'error', message: error.message });
			});
	}

	// Update the count and timestamp for the domain
	await db
		.collection('domains')
		.doc(`${domain}`)
		.update({ count: FieldValue.increment(1), timestamp }) // Update the count
		.catch(async (error) => {
			return res.status(500).send({ status: 'error', message: error.message });
		});

	// Add the toot to the domain
	await db
		.collection(`domains/${domain}/toots`)
		.doc(`${tootId}`)
		.set(thisToot)
		.catch(async (error) => {
			return res.status(500).send({ status: 'error', message: error.message });
		});

	// Add the language to list of languages
	if (addLanguage && language) {
		await db
			.collection('languages')
			.doc(`${language}`)
			.set({ count: 0, createdAt: timestamp, timestamp })
			.catch(async (error) => {
				return res.status(500).send({ status: 'error', message: error.message });
			});
	}

	// Add the toot to the list of languages
	if (language) {
		await db
			.collection('languages')
			.doc(`${language}`)
			.update({ count: FieldValue.increment(1), timestamp }) // Update the count
			.catch(async (error) => {
				return res.status(500).send({ status: 'error', message: error.message });
			});

		await db
			.collection(`languages/${language}/toots`)
			.doc(`${tootId}`)
			.set(thisToot)
			.catch(async (error) => {
				return res.status(500).send({ status: 'error', message: error.message });
			});
	}

	res.status(201).send({ status: 201, tootsDocumentId: tootsDocument.id });
});

export const tootPosted = onRequest({ cors: true }, app);
