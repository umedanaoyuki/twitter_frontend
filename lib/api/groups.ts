import { requireSessionCookieHeader } from "@/lib/session";

import { apiClient } from "./client";
import { getApiErrorMessage } from "./errors";
import type {
  ApiGroup,
  CreateGroupBody,
  CreateGroupResponse,
  CreateMessageResponse,
  GetMessagesResponse,
} from "./types";

/** ログイン中のユーザーが所属するグループ一覧を取得する。 */
export async function getGroups(): Promise<ApiGroup[]> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.GET("/groups", {
    // GinにセッションIDを送る
    headers: { Cookie: cookieHeader },
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

/** グループを作成する。作成者はバックエンド側で自動的にメンバーに含まれる。 */
export async function createGroup(
  body: CreateGroupBody,
): Promise<CreateGroupResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.POST("/groups", {
    body,
    headers: { Cookie: cookieHeader },
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

/** グループ内のメッセージ一覧を取得する（メンバーのみ）。 */
export async function getGroupMessages(
  groupId: number,
): Promise<GetMessagesResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.GET(
    "/groups/{group_id}/messages",
    {
      params: {
        path: { group_id: groupId },
      },
      headers: { Cookie: cookieHeader },
    },
  );

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

/** グループにメッセージを送信する（メンバーのみ）。 */
export async function createGroupMessage(
  groupId: number,
  content: string,
): Promise<CreateMessageResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  const { data, error, response } = await apiClient.POST(
    "/groups/{group_id}/messages",
    {
      params: {
        path: { group_id: groupId },
      },
      body: { content },
      headers: { Cookie: cookieHeader },
    },
  );

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}
