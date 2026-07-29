import { requireSessionCookieHeader } from "@/lib/session";

import { apiClient } from "./client";
import { getApiErrorMessage } from "./errors";
import type {
  CompleteImageTweetInput,
  CreateImageTweetResponse,
  CreateTweetInput,
  CreateTweetResponse,
  DeleteTweetResponse,
  GetAllTweetsResponse,
  GetCurrentUserTweetsResponse,
  GetTweetResponse,
  GetUserRetweetsResponse,
  GetUserTweetsResponse,
  PresignImageTweetInput,
  PresignImageTweetResponse,
  RetweetResponse,
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

export async function presignTweetImage(
  input: PresignImageTweetInput,
): Promise<PresignImageTweetResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.POST(
    "/tweets-image/presign",
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

export async function completeTweetImage(
  key: string,
): Promise<CreateImageTweetResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const input: CompleteImageTweetInput = { key };
  const { data, error, response } = await apiClient.POST(
    "/tweets-image/complete",
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

/** 登録されている全ユーザーのツイートを取得する（認証不要） */
export async function getAllTweets(options?: {
  cursor?: number;
  limit?: number;
}): Promise<GetAllTweetsResponse> {
  const { data, error, response } = await apiClient.GET("/tweets", {
    params: {
      query: {
        cursor: options?.cursor,
        limit: options?.limit ?? 20,
      },
    },
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

export async function getTweet(id: number): Promise<GetTweetResponse | null> {
  const { data, error, response } = await apiClient.GET("/tweets/{id}", {
    params: {
      path: { id },
    },
  });

  if (error) {
    if (response.status === 404) {
      return null;
    }
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

/** 指定ツイートをリツイートする */
export async function retweetTweet(tweetId: number): Promise<RetweetResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.POST(
    "/tweets/{id}/retweet",
    {
      params: {
        path: { id: tweetId },
      },
      headers: { Cookie: cookieHeader },
    },
  );

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

/** 指定ツイートのリツイートを解除する */
export async function undoRetweetTweet(
  tweetId: number,
): Promise<RetweetResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.DELETE(
    "/tweets/{id}/retweet",
    {
      params: {
        path: { id: tweetId },
      },
      headers: { Cookie: cookieHeader },
    },
  );

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

/** 指定ユーザーがリツイートしたツイート一覧を取得する（認証不要） */
export async function getUserRetweets(
  userId: number,
  options?: { cursor?: number; limit?: number },
): Promise<GetUserRetweetsResponse> {
  const { data, error, response } = await apiClient.GET(
    "/users/{user_id}/retweets",
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

export async function deleteTweet(
  tweetId: number,
): Promise<DeleteTweetResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.DELETE("/tweets/{id}", {
    params: {
      path: { id: tweetId },
    },
    headers: { Cookie: cookieHeader },
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}
