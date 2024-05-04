export interface ChatMessage {
  content: string;
  userName: string;
}

export function validateChatMessage(message: any): ChatMessage | undefined {
  if (typeof message !== "object") {
    return;
  }

  const content = message.content;
  const userName = message.userName;

  if (
    typeof content !== "string" ||
    typeof userName !== "string"
  ) {
    return;
  }

  return {
    content,
    userName
  };
}