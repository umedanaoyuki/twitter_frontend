import { apiClient } from "./client";
import { getApiErrorMessage } from "./errors";
import type { GetFollowingResponse } from "./types";

/** 指定ユーザーがフォローしているユーザーをカーソルページネーションで取得する。 */
export async function getFollowing(
  userId: number,
  options?: { cursor?: number; limit?: number },
): Promise<GetFollowingResponse> {
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
    },
  );

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}
