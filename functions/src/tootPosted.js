import express from 'express';
import { body, validationResult } from 'express-validator';
import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { FieldValue } from 'firebase-admin/firestore';
import { addToot } from './collections/toots.js';
import {
	addAccountToDomain,
	addDomainToCollection,
	addTootToDomain,
	updateDomain
} from './collections/domains.js';
import { addTags } from './collections/tags.js';
import { addAccount, addTootToAccount } from './collections/accounts.js';
import {
	addLanguageToCollection,
	addTootToLanguage,
	updateLanguage
} from './collections/languages.js';

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
		instance,
		language,
		previewUrl,
		remoteUrl,
		sensitive,
		tags,
		tootId,
		uri,
		visibility
	} = req.body;

	const timestamp = FieldValue.serverTimestamp();

	const thisToot = {
		acct,
		accountId,
		content,
		createdAt,
		domain,
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

	const tootsDocument = await addToot(thisToot).catch((err) => {
		return res.status(500).send({ status: 'error', message: err.message });
	});

	if (tags) {
		await addTags({ toot: thisToot, tags }).catch((err) => {
			return res.status(500).send({ status: 'error', message: err.message });
		});
	}

	// Add the account to the collection
	if (account) {
		await addAccount({ account, acct }).catch((err) => {
			return res.status(500).send({ status: 'error', message: err.message });
		});

		await addAccountToDomain({ acct, account, domain }).catch((err) => {
			return res.status(500).send({ status: 'error', message: err.message });
		});
	}

	// Add the toot to the account collection
	await addTootToAccount({ acct, toot: thisToot, tootId }).catch((err) => {
		return res.status(500).send({ status: 'error', message: err.message });
	});

	// Add the domain to the collection
	if (addDomain) {
		await addDomainToCollection({ domain, instance }).catch((err) => {
			return res.status(500).send({ status: 'error', message: err.message });
		});
	}

	// Update the count for the domain
	await updateDomain({ domain }).catch((err) => {
		return res.status(500).send({ status: 'error', message: err.message });
	});

	// Add the toot to the domain
	await addTootToDomain({ domain, toot: thisToot, tootId }).catch((err) => {
		return res.status(500).send({ status: 'error', message: err.message });
	});

	// Add the language to list of languages
	if (addLanguage && language) {
		await addLanguageToCollection({ language }).catch((err) => {
			return res.status(500).send({ status: 'error', message: err.message });
		});
	}

	// Add the toot to the list of languages
	if (language) {
		await updateLanguage({ language }).catch((err) => {
			return res.status(500).send({ status: 'error', message: err.message });
		});

		await addTootToLanguage({ language, toot: thisToot, tootId }).catch((err) => {
			return res.status(500).send({ status: 'error', message: err.message });
		});
	}

	res.status(201).send({ status: 201, tootsDocumentId: tootsDocument.id });
});

export const tootPosted = onRequest({ cors: true }, app);
