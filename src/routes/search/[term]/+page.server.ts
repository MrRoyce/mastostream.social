import type { PageServerLoad } from './$types';
import axios from 'axios'
import { formatToot } from '$lib/utils/formatToot';
import { VITE_ESURL, VITE_ESAUTH } from '$env/static/private'

// Call elastic search
export const load: PageServerLoad = (async (event) => {

  const term = event.params.term
  const esURL = VITE_ESURL
  const esAuth = VITE_ESAUTH

  const data = JSON.stringify({
    "query": {
      "match": {
        "content": {
          "query": term,
          "fuzziness": "AUTO"
        }
      }
    }
  });

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${esURL}/_search`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  const response = await axios.request(config)
  const items = response.data?.hits?.hits?.map((item) => {
    return formatToot(item._source)
  })

  return { toots: items, term };
});