export const MAX_TWEET_LENGTH = 140;
export {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from "@/lib/validation/image";

export function getTweetLength(content: string): number {
  return [...content].length;
}

export function validateTweetContent(content: string): string | null {
  const trimmed = content.trim();

  if (!trimmed) {
    return "ツイート内容を入力してください";
  }

  if (getTweetLength(trimmed) > MAX_TWEET_LENGTH) {
    return `ツイートは${MAX_TWEET_LENGTH}文字以内で入力してください`;
  }

  return null;
}
