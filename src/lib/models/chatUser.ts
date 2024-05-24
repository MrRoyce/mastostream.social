export interface ChatUser {
  acct: string;
  room: string;
  type: string;
  uid: string;
}

export function validateChatUser(user: any): ChatUser | undefined {

  if (typeof user !== "object") {
    return;
  }

  const { acct, room, type, uid } = user


  if (
    typeof acct !== "string" ||
    typeof room !== "string" ||
    typeof type !== "string" ||
    typeof uid !== "string"
  ) {
    return;
  }

  return {
    acct,
    room,
    type,
    uid
  };
}