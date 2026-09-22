export const MAX_MESSAGE_LENGTH = 500;

export function getMessageLength(content: string): number {
  return [...content].length;
}

export function validateMessageContent(content: string): string | null {
  const trimmed = content.trim();

  if (!trimmed) {
    return "メッセージを入力してください";
  }

  if (getMessageLength(trimmed) > MAX_MESSAGE_LENGTH) {
    return `メッセージは${MAX_MESSAGE_LENGTH}文字以内で入力してください`;
  }

  return null;
}
