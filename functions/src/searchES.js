import axios from 'axios';
import { logger } from 'firebase-functions';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

export const searchES = onCall(async (request) => {
	const term = request.data.term;

	const esURL = process.env.ESURL;
	const esAuth = process.env.ESAUTH;

	const data = JSON.stringify({
		query: {
			match: {
				content: {
					query: term,
					fuzziness: 'AUTO'
				}
			}
		}
	});

	const config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: `${esURL}/_search`,
		headers: {
			'Content-Type': 'application/json',
			Authorization: esAuth
		},
		data: data
	};

	const response = await axios.request(config);

	return { status: 200, data: response.data };
});
