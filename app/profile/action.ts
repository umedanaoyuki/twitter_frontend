"use server";

import { revalidatePath } from "next/cache";

import { createUserProfile, updateUserProfile } from "@/lib/api/profile";
import type { ProfileFormValues } from "@/lib/types/profile";
import { validateProfile, hasProfileErrors } from "@/lib/validation/profile";

export type SaveProfileState =
  | { error: string }
  | { success: true; message: string };

/**
 * プロフィールを保存する。
 * exists=false（未作成）の場合は POST /profile で作成し、
 * それ以外は PUT /profile で更新する。
 */
export async function saveProfileAction(
  values: ProfileFormValues,
  exists: boolean,
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

    revalidatePath("/profile");
    return {
      success: true,
      message: exists ? "プロフィールを更新しました" : "プロフィールを作成しました",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "プロフィールの保存に失敗しました",
    };
  }
}
