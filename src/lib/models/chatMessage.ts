export interface ChatMessage {
  content: string;
  userName: string;
  time?: string | null;
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
    console.error('Invalid message!', message)
    return;
  }

  return {
    content,
    userName,
    type
  };
}