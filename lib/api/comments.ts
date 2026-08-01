import { requireSessionCookieHeader } from "@/lib/session";

import { apiClient } from "./client";
import { getApiErrorMessage } from "./errors";
import type { CreateCommentResponse, GetCommentsResponse } from "./types";

export async function createComment(
  tweetId: number,
  content: string,
): Promise<CreateCommentResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.POST(
    "/tweets/{id}/comments",
    {
      params: {
        path: { id: tweetId },
      },
      body: { content },
      // GinにセッションIDを送る
      headers: { Cookie: cookieHeader },
    },
  );

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

export async function getComments(
  tweetId: number,
  options?: { cursor?: number; limit?: number },
): Promise<GetCommentsResponse> {
  const { data, error, response } = await apiClient.GET(
    "/tweets/{id}/comments",
    {
      params: {
        path: { id: tweetId },
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
