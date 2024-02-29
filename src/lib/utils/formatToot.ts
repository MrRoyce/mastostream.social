type Toot = {
  acct: string;
  avatar: string;
  bot: string;
  content: string;
  createdAt: string;
  domain: string;
  id: string;
  language: string;
  sensitive: boolean;
  uri: string;
  visibility: boolean;

}

export const formatToot = (toot: Toot,) => {
  const createdAtArray = toot.createdAt.split('T')
  // eslint-disable-next-line prefer-const
  let { accountId, tootId } = toot

  tootId = (tootId) ? tootId : toot.id.split('_')[1]
  accountId = (accountId) ? accountId : toot.id.split('_')[0]

  return {
    ...toot,
    id: toot.id,
    avatar: toot.avatar,
    sensitive: toot.sensitive,
    type: toot.bot,
    createdAt: `${createdAtArray[0]} ${createdAtArray[1].split('.')[0]}`,
    acct: toot.acct,
    language: toot.language,
    content: toot.content,
    uri: toot.uri,
    visibility: toot.visibility,
    accountId,
    tootId
  }
}
