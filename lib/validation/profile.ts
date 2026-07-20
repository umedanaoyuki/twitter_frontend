import type { ProfileFormValues } from "@/lib/types/profile";

export const MAX_PROFILE_NAME_LENGTH = 50;
export const MAX_PROFILE_BIO_LENGTH = 160;
export const MAX_PROFILE_LOCATION_LENGTH = 30;

function length(value: string): number {
  return [...value.trim()].length;
}

export type ProfileFieldErrors = Partial<
  Record<keyof ProfileFormValues, string>
>;

/**
 * プロフィール入力値を検証し、フィールドごとのエラーメッセージを返す。
 * エラーがなければ空オブジェクトを返す。
 */
export function validateProfile(values: ProfileFormValues): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};

  const name = values.name.trim();
  if (!name) {
    errors.name = "名前を入力してください";
  } else if (length(values.name) > MAX_PROFILE_NAME_LENGTH) {
    errors.name = `名前は${MAX_PROFILE_NAME_LENGTH}文字以内で入力してください`;
  }

  if (length(values.bio) > MAX_PROFILE_BIO_LENGTH) {
    errors.bio = `自己紹介は${MAX_PROFILE_BIO_LENGTH}文字以内で入力してください`;
  }

  if (length(values.location) > MAX_PROFILE_LOCATION_LENGTH) {
    errors.location = `場所は${MAX_PROFILE_LOCATION_LENGTH}文字以内で入力してください`;
  }

  const imageUrl = values.imageUrl.trim();
  if (imageUrl && !/^https?:\/\//.test(imageUrl)) {
    errors.imageUrl = "画像URLは http:// または https:// で始まる必要があります";
  }

  return errors;
}

export function hasProfileErrors(errors: ProfileFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
