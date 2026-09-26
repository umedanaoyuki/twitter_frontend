import { requireSessionCookieHeader } from "@/lib/session";

import { apiClient } from "./client";
import { getApiErrorMessage } from "./errors";
import type {
  GetNotificationCountResponse,
  GetNotificationsResponse,
} from "./types";

/** ログイン中のユーザー宛の通知一覧を新しい順に取得する */
export async function getNotifications(options?: {
  cursor?: number;
  limit?: number;
}): Promise<GetNotificationsResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.GET("/notifications", {
    params: {
      query: {
        cursor: options?.cursor,
        limit: options?.limit ?? 20,
      },
    },
    headers: { Cookie: cookieHeader },
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

/** ログイン中のユーザー宛の未読通知件数を取得する */
export async function getNotificationCount(): Promise<GetNotificationCountResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.GET(
    "/notifications/count",
    {
      headers: { Cookie: cookieHeader },
    },
  );

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}
