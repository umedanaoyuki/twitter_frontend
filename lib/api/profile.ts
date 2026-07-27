import { requireSessionCookieHeader } from "@/lib/session";

import { apiClient } from "./client";
import { getApiErrorMessage } from "./errors";
import type {
  CompleteProfileImageInput,
  CreateUserProfileBody,
  PresignProfileImageInput,
  PresignProfileImageResponse,
  SwaggerUserProfile,
  UpdateUserProfileBody,
} from "./types";

/**
 * 指定ユーザーのプロフィールを取得する。
 * プロフィールが未作成（404）の場合は null を返す。
 */
export async function getUserProfile(
  userId: number,
): Promise<SwaggerUserProfile | null> {
  const { data, error, response } = await apiClient.GET(
    "/users/{user_id}/profile",
    {
      params: {
        path: { user_id: userId },
      },
    },
  );

  if (error) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data.profile ?? null;
}

/** ログイン中のユーザーのプロフィールを作成する。 */
export async function createUserProfile(
  input: CreateUserProfileBody,
): Promise<SwaggerUserProfile | null> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.POST("/profile", {
    body: input,
    headers: { Cookie: cookieHeader },
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data.profile ?? null;
}

/** プロフィール画像をS3へ直接アップロードするためのURLとkeyを発行する。 */
export async function presignProfileImage(
  input: PresignProfileImageInput,
): Promise<PresignProfileImageResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.POST(
    "/profile-image/presign",
    {
      body: input,
      headers: { Cookie: cookieHeader },
    },
  );

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

/**
 * アップロード済み画像をプロフィール画像として確定する。
 * プロフィール未作成の場合はGin側で404になるため、先に作成しておくこと。
 */
export async function completeProfileImage(
  key: string,
): Promise<SwaggerUserProfile | null> {
  const cookieHeader = await requireSessionCookieHeader();
  const input: CompleteProfileImageInput = { key };
  const { data, error, response } = await apiClient.POST(
    "/profile-image/complete",
    {
      body: input,
      headers: { Cookie: cookieHeader },
    },
  );

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data.profile ?? null;
}

/** ログイン中のユーザーのプロフィールを更新する。 */
export async function updateUserProfile(
  input: UpdateUserProfileBody,
): Promise<SwaggerUserProfile | null> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.PUT("/profile", {
    body: input,
    headers: { Cookie: cookieHeader },
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data.profile ?? null;
}
