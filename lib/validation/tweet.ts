export const MAX_TWEET_LENGTH = 140;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"] as const;

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

export function validateTweetImage(image: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(image.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return "対応していない画像形式です（JPEG, PNG のみ）";
  }

  if (image.size > MAX_IMAGE_SIZE_BYTES) {
    return "画像は5MB以下にしてください";
  }

  return null;
}
