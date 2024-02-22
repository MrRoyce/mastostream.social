type Toot = {
  id: string;
  createdAt: string;
  sensitive: boolean;
  domain: string;
  acct: string;
  content: string;
  uri: string;
  language: string;
  visibility: boolean;

}

export const formatToot = (toot: Toot, includeAcct: boolean) => {
  const createdAtArray = toot.createdAt.split('T')

  if (includeAcct) {
    return {
      id: toot.id,
      createdAt: `${createdAtArray[0]} ${createdAtArray[1].split('.')[0]}`,
      sensitive: !toot.sensitive,
      acct: toot.acct,
      content: toot.content,
      uri: toot.uri,
      domain: toot.domain,
      language: toot.language,
      visibility: toot.visibility
    }
  } else
    return {
      id: toot.id,
      createdAt: `${createdAtArray[0]} ${createdAtArray[1].split('.')[0]}`,
      sensitive: !toot.sensitive,
      content: toot.content,
      uri: toot.uri,
      acct: toot.acct,
      domain: toot.domain,
      language: toot.language,
      visibility: toot.visibility
    }
}
