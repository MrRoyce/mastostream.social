import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDocument } from '$lib/getCollection';

const maxParamLength = 50
const maxGroupLength = 40

export const load: PageServerLoad = (async ({ params, locals, url }) => {

  const user = locals.user
  const groupId = url.searchParams.get('gid')

  if (!user || !groupId || groupId.length > maxGroupLength) {
    redirect(307, '/')
  }

  if (!params.group || params.group.length > maxParamLength) {
    console.warn(`params.group.length > ${maxParamLength}`, params.group.length)
    throw redirect(307, '/')
  }


  const userDocument = (user.uid) ? await getDocument({ entity: 'users', id: user.uid }) : {}
  const group = await getDocument({ entity: 'groups', id: groupId })

  const groupUid = user ? `${user.uid}_${userDocument?.acct}` : undefined

  if (group) {
    if (!group.groupMembers.includes(groupUid)) {
      redirect(307, '/')
    }
    group.creator = group.creatorId === user.uid ? true : false;
    group.moderator = group.groupModerators.includes(groupUid) ? true : false;
    group.member = group.groupMembers.includes(groupUid) ? true : false;
  } else {
    redirect(307, '/')
  }

  return {
    acct: userDocument?.acct || '',
    group: JSON.parse(JSON.stringify(group)),
    user
  };
});