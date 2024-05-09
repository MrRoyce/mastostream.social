export interface ChatRoom {
  acct: string;
  creator: string;
  name: string;
  roomId: string;
  type: string;
}

export function validateChatRoom(room: any): ChatRoom | undefined {
  if (typeof room !== "object") {
    return;
  }
  const { acct, creator, name, roomId, type } = room

  if (
    typeof acct !== "string" ||
    typeof creator !== "string" ||
    typeof name !== "string" ||
    typeof roomId !== "string" ||
    typeof type !== "string"
  ) {
    return;
  }

  return {
    acct, creator, name, roomId, type
  };
}