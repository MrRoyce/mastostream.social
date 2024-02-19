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

export const formatToot = (toot: Toot) => {
  const createdAtArray = toot.createdAt.split('T')
  return {
    id: toot.id,
    createdAt: `${createdAtArray[0]} ${createdAtArray[1].split('.')[0]}`,
    sensitive: !toot.sensitive,
    domain: toot.domain,
    acct: toot.acct,
    content: toot.content,
    uri: toot.uri,
    language: toot.language,
    visibility: toot.visibility
  }
}