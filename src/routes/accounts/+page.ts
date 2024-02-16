import type { PageLoad } from './$types';

import type {
  DocumentData
} from 'firebase/firestore';
import { formatDate } from '$lib/utils/formatDate'
import { getData } from '$lib/getCollection';

export const load: PageLoad = (async () => {

  const response: DocumentData[] = await getData({ entity: 'accounts', max: 100, orderByField: 'createdAt' });

  const items = response.map((item) => {
    const createdAt = (item.createdAt) ? formatDate({ seconds: item.createdAt.seconds, nanoseconds: item.createdAt.nanoseconds }) : '';

    return {
      id: item.id, // Get the id from doc, not doc.data()!
      avatar: item.avatar,
      displayName: item.displayName,
      bot: (item.bot) ? "🤖" : "👤",
      acct: item.acct,
      followersCount: item.followersCount,
      followingCount: item.followingCount,
      statusesCount: item.statusesCount,
      createdAt,
      lastStatusAt: item.lastStatusAt,
      fields: item.fields,
      locked: item.locked,
      timestamp: item.timestamp,
      url: item.url,
      username: item.username
    }
  })

  return { entities: items };
})