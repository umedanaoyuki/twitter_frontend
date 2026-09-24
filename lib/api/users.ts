import {
  getSessionCookieHeader,
  requireSessionCookieHeader,
} from "@/lib/session";

import { apiClient } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/errors";
import type {
  FollowResponse,
  GetFollowingResponse,
  GetUserResponse,
  StatusOKResponse,
} from "@/lib/api/types";

export async function getUserById(userId: number): Promise<GetUserResponse> {
  const { data, error, response } = await apiClient.GET("/users/{user_id}", {
    params: {
      path: { user_id: userId },
    },
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

/** 指定ユーザーをフォローする */
export async function followUser(userId: number): Promise<FollowResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.POST(
    "/users/{user_id}/follow",
    {
      params: {
        path: { user_id: userId },
      },
      headers: { Cookie: cookieHeader },
    },
  );

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

/** 指定ユーザーのフォローを解除する */
export async function unfollowUser(userId: number): Promise<FollowResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.DELETE(
    "/users/{user_id}/follow",
    {
      params: {
        path: { user_id: userId },
      },
      headers: { Cookie: cookieHeader },
    },
  );

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

/** 指定ユーザーがフォローしているユーザー一覧を取得する */
export async function getUserFollowing(
  userId: number,
  options?: { cursor?: number; limit?: number },
): Promise<GetFollowingResponse> {
  // 仕様上401を返しうるAPIなので、ログイン中ならCookieを付けて呼ぶ
  const cookieHeader = await getSessionCookieHeader();
  const { data, error, response } = await apiClient.GET(
    "/users/{user_id}/following",
    {
      params: {
        path: { user_id: userId },
        query: {
          cursor: options?.cursor,
          limit: options?.limit ?? 20,
        },
      },
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    },
  );

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

export async function deleteAccount(): Promise<StatusOKResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  console.log("cookieHeader", cookieHeader);
  const { data, error, response } = await apiClient.DELETE("/user", {
    headers: { Cookie: cookieHeader },
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}
