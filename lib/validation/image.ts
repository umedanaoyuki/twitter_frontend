/** 画像アップロード共通の制約（Gin側の storage.MaxImageSize / allowedImageMIMEs と揃える） */
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"] as const;

export function validateImageFile(image: File): string | null {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      image.type as (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    return "対応していない画像形式です（JPEG, PNG のみ）";
  }

  if (image.size > MAX_IMAGE_SIZE_BYTES) {
    return "画像は5MB以下にしてください";
  }

  return null;
}
