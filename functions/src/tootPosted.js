import { initializeApp } from 'firebase-admin/app';
initializeApp();
import express from 'express';
import { body, validationResult } from 'express-validator';
import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import admin from 'firebase-admin';

const app = express();
app.use(express.json());

const siteCreationValidators = [
	body('content').notEmpty(),
	body('createdAt').notEmpty(),
	body('language').notEmpty(),
	body('tootId').notEmpty(),
	body('uri').notEmpty()
];

app.post('/tootposted', siteCreationValidators, async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		logger.error('Missing required fields', JSON.stringify(errors));
		return res.status(400).json({ errors: 'Invalid input' });
	}

	const { content, createdAt, language, tootId, uri, imageUrl, previewUrl, remoteUrl } = req.body;

	const db = admin.firestore();
	const tootsDocument = await db
		.collection('toots')
		.add({
			content,
			createdAt,
			language,
			tootId,
			uri,
			imageUrl: imageUrl || '',
			previewUrl: previewUrl || '',
			remoteUrl: remoteUrl || ''
		})
		.catch(async (error) => {
			return res.status(400).send({ status: 'error', message: error.message });
		});

	res.status(200).send({ status: 200, tootsDocumentId: tootsDocument.id });
});

export const tootPosted = onRequest({ cors: true }, app);
