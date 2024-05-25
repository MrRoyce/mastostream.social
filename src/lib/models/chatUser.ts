export interface ChatUser {
  acct: string;
  room: string;
  socketId: string;
  type: string;
  uid: string;
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
    uid
  };
}