import axios from 'axios';
import { logger } from 'firebase-functions';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

export const searchES = onCall(async (request) => {
	const term = request.data.term;
	const type = request.data.type;

	const esURL = process.env.ESURL;
	const esAuth = process.env.ESAUTH;

	const data = JSON.stringify({
		size: 50,
		query: {
			bool: {
				must: [
					{
						match: {
							content: {
								query: term,
								fuzziness: 'AUTO'
							}
						}
					},
					{
						match: {
							type: type
						}
					}
				]
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

	let response;

	try {
		response = await axios.request(config);
	} catch (error) {
		logger.error(`Call to Elasticsearch failed: ${JSON.stringify(error)}`);
		throw new HttpsError('internal', JSON.stringify(error));
	}

	return { status: 200, data: response?.data };
});
