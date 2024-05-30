export interface ChatUser {
  acct: string;
  room: string;
  socketId: string;
  type: string;
  uid: string;
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
  userID: string;
  username: string;
}

export function validatePrivateUser(user: any): ChatPrivateUser | undefined {

  if (typeof user !== "object") {
    return;
  }

  const { connected, messages, uid, userID, username } = user
  console.log('validatePrivateUser user', user)

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

  const { acct, id, room, type, uid } = user
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
    room,
    socketId: id,
    type,
    uid,
  };
}