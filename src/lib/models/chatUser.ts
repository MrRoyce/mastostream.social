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
}

export function validatePrivateUser(user: any): ChatPrivateUser | undefined {

  if (typeof user !== "object") {
    return;
  }

  const { connected, uid, userID, username } = user

  if (
    typeof connected !== "boolean" ||
    typeof userID !== "string" ||
    typeof username !== "string"
  ) {
    return;
  }

  return {
    connected, uid, userID, username
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