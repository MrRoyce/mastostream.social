import type { PageLoad } from './$types';

import type {
  DocumentData
} from 'firebase/firestore';
import { formatDate } from '$lib/utils/formatDate'
import { getData } from '$lib/getCollection';

export const load: PageLoad = (async () => {

  const response: DocumentData[] = await getData({ entity: 'accounts', max: 100 });

  const items = response.map((item) => {
    const timestamp = (item.timestamp) ? formatDate({ seconds: item.timestamp.seconds, nanoseconds: item.timestamp.nanoseconds }) : '';

    return {
      id: item.id, // Get the id from doc, not doc.data()!
      acct: item.acct,

      bot: !item.bot,
      createdAt: item.createdAt,
      displayName: item.displayName,
      followersCount: item.followersCount,
      followingCount: item.followingCount,
      lastStatusAt: item.lastStatusAt,
      statusesCount: item.statusesCount,
      fields: item.fields,
      locked: item.locked,
      avatar: item.avatar,
      timestamp,
      url: item.url,
      username: item.username
    }
  })

  return { entities: items };
})