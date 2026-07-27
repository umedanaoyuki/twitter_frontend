"use server";

import { revalidatePath } from "next/cache";

import {
  completeProfileImage,
  createUserProfile,
  presignProfileImage,
  updateUserProfile,
} from "@/lib/api/profile";
import type { ProfileFormValues } from "@/lib/types/profile";
import { validateProfile, hasProfileErrors } from "@/lib/validation/profile";

export type SaveProfileState =
  | { error: string }
  | { success: true; message: string };

export type PresignProfileImageState =
  | { error: string }
  | { success: true; key: string; uploadUrl: string; publicUrl: string };

/** プロフィール画像のアップロード先URLとkeyを発行する。 */
export async function presignProfileImageAction(
  contentType: string,
  size: number,
): Promise<PresignProfileImageState> {
  try {
    const result = await presignProfileImage({
      content_type: contentType,
      size,
    });
    if (!result.key || !result.upload_url) {
      return { error: "画像のアップロード準備に失敗しました" };
    }

    return {
      success: true,
      key: result.key,
      uploadUrl: result.upload_url,
      publicUrl: result.public_url ?? "",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "画像のアップロード準備に失敗しました",
    };
  }
}

/**
 * プロフィールを保存する。
 * exists=false（未作成）の場合は POST /profile で作成し、
 * それ以外は PUT /profile で更新する。
 * imageKey が渡された場合は、保存後に POST /profile-image/complete で
 * アップロード済み画像をプロフィール画像として確定する。
 */
export async function saveProfileAction(
  values: ProfileFormValues,
  exists: boolean,
  imageKey?: string | null,
): Promise<SaveProfileState> {
  const errors = validateProfile(values);
  if (hasProfileErrors(errors)) {
    const firstError = Object.values(errors)[0];
    return { error: firstError ?? "入力内容を確認してください" };
  }

  const body = {
    name: values.name.trim(),
    bio: values.bio.trim(),
    location: values.location.trim(),
    image_url: values.imageUrl.trim(),
  };

  try {
    if (exists) {
      await updateUserProfile(body);
    } else {
      await createUserProfile(body);
    }

    // complete はプロフィールが存在しないと404になるため、作成/更新の後に実行する
    if (imageKey) {
      await completeProfileImage(imageKey);
    }

    revalidatePath("/profile");
    return {
      success: true,
      message: exists
        ? "プロフィールを更新しました"
        : "プロフィールを作成しました",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "プロフィールの保存に失敗しました",
    };
  }
}
