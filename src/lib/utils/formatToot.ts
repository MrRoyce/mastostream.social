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
  const [accountId, tootId] = toot.id.split('_')
  console.log('accountId', accountId)
  console.log('tootId', tootId)
  console.log('toot.id', toot.id)

  return {
    ...toot,
    id: toot.id,
    avatar: toot.avatar,
    sensitive: !toot.sensitive, // sensitive would be true and would cause the toottable to show the wrong icon!
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
