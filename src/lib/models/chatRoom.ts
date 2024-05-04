export interface ChatRoom {
  creator: string;
  rid: string;
  roomName: string;
  type: string;
}

export function validateChatRoom(room: any): ChatRoom | undefined {
  if (typeof room !== "object") {
    return;
  }
  const { creator, rid, roomName, type } = room

  if (
    typeof creator !== "string" ||
    typeof rid !== "string" ||
    typeof roomName !== "string" ||
    typeof type !== "string"
  ) {
    return;
  }

  return {
    creator,
    rid,
    roomName,
    type
  };
}