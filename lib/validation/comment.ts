export const MAX_COMMENT_LENGTH = 140;

export function getCommentLength(content: string): number {
  return [...content].length;
}

export function validateCommentContent(content: string): string | null {
  const trimmed = content.trim();

  if (!trimmed) {
    return "コメント内容を入力してください";
  }

  if (getCommentLength(trimmed) > MAX_COMMENT_LENGTH) {
    return `コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください`;
  }

  return null;
}
