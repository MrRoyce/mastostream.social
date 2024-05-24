export interface ChatMessage {
  content: string;
  userName: string;
  time: string;
  type: string;
}

export function validateChatMessage(message: { content: string; userName: string; type: string; }): ChatMessage | undefined {
  if (typeof message !== "object") {
    return;
  }
  const { content, type, userName } = message

  if (
    typeof content !== "string" ||
    typeof userName !== "string" ||
    typeof type !== "string"
  ) {
    return;
  }

  return {
    content,
    userName,
    type
  };
}