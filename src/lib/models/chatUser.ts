export interface ChatUser {
  acct: string;
  connected: boolean;
  newMessagesCount?: number;
  room: string;
  socketId: string;
  type: string;
  uid: string;
  userID: string;
  username: string;
}

export interface ChatPrivateUser {
  connected: boolean;
  uid: string;
  userID: string;
  username: string;
  createdAt?: string;
  sessionID?: string;
}

export function validatePrivateUser(user: any): ChatPrivateUser | undefined {

  console.log('typeof user', typeof user)

  if (typeof user !== "object") {
    console.error(' bad user not object', user)
    return;
  }

  const { connected, createdAt, sessionID, uid, userID, username } = user

  if (
    createdAt === '' ||
    sessionID === '' ||
    uid === '' ||
    userID === '' ||
    username === '' ||
    typeof createdAt !== "string" ||
    typeof sessionID !== "string" ||
    typeof uid !== "string" ||
    typeof userID !== "string" ||
    typeof username !== "string"
  ) {
    console.log('Bad user after validation', JSON.stringify(user))
    return;
  }

  return {
    connected, createdAt, sessionID, uid, userID, username
  };

}

export function validateChatUser(user: any): ChatUser | undefined {

  if (typeof user !== "object") {
    return;
  }

  const { acct, connected, id, room, type, uid, userID, username } = user
  console.log('validateChatUser user', user)

  if (
    typeof acct !== "string" ||
    typeof id !== "string" ||
    typeof room !== "string" ||
    typeof type !== "string" ||
    typeof uid !== "string"
  ) {
    return;
  }

  return {
    acct,
    connected,
    room,
    socketId: id,
    type,
    uid,
    userID,
    username
  };
}