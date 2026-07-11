import { requireSessionCookieHeader } from "@/lib/session";

import { apiClient } from "./client";
import { getApiErrorMessage } from "./errors";
import type {
  CreateImageTweetResponse,
  CreateTweetInput,
  CreateTweetResponse,
  ErrorResponse,
  GetCurrentUserTweetsResponse,
  GetUserTweetsResponse,
} from "./types";

export async function createTweet(
  input: CreateTweetInput,
): Promise<CreateTweetResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.POST("/tweets", {
    body: input,
    headers: { Cookie: cookieHeader },
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

export async function createImageTweet(
  image: File,
): Promise<CreateImageTweetResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch(`${process.env.API_BASE_URL}/tweets-image`, {
    method: "POST",
    headers: { Cookie: cookieHeader },
    body: formData,
  });

  const body = (await response.json()) as
    | CreateImageTweetResponse
    | ErrorResponse;

  if (!response.ok) {
    throw new Error(getApiErrorMessage(body as ErrorResponse, response.status));
  }

  return body as CreateImageTweetResponse;
}

export async function getCurrentUserTweets(options?: {
  cursor?: number;
  limit?: number;
}): Promise<GetCurrentUserTweetsResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.GET("/user/tweets", {
    params: {
      query: {
        cursor: options?.cursor,
        limit: options?.limit ?? 20,
      },
    },
    // GinにセッションIDを送る
    headers: { Cookie: cookieHeader },
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

export async function getUserTweets(
  userId: number,
  options?: { cursor?: number; limit?: number },
): Promise<GetUserTweetsResponse> {
  const { data, error, response } = await apiClient.GET(
    "/users/{user_id}/tweets",
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
