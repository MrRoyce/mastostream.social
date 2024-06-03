export interface ChatUser {
  acct: string;
  connected: boolean;
  room: string;
  socketId: string;
  type: string;
  uid: string;
  userID: string;
  username: string;
}

type MessageType = {
  content: string;
  from: string;
  to: string;
}

type MyMessages = Array<MessageType>

export interface ChatPrivateUser {
  connected: boolean;
  messages: MyMessages;
  uid: string;
  userID: string;
  username: string;
}

export function validatePrivateUser(user: any): ChatPrivateUser | undefined {

  if (typeof user !== "object") {
    return;
  }

  const { connected, messages, uid, userID, username } = user
  // console.log('validatePrivateUser user', JSON.stringify(user, null, 2))

  if (
    typeof connected !== "boolean" ||
    !Array.isArray(messages) ||
    typeof uid !== "string" ||
    typeof userID !== "string" ||
    typeof username !== "string"
  ) {
    return;
  }

  return {
    connected, messages, uid, userID, username
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