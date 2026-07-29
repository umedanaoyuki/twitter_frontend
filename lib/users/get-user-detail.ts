import { cache } from "react";

import { getUserById } from "@/lib/api/users";
import type { SwaggerUserDetail } from "@/lib/api/types";

/**
 * ユーザーIDからユーザー情報を取得する。取得できなかった場合は null。
 *
 * タイムラインでは同じ投稿者のツイートが複数並ぶため、cache() で包んで
 * 同一リクエスト内の重複アクセスを1回にまとめている。
 */
export const getUserDetail = cache(
  async (userId: number): Promise<SwaggerUserDetail | null> => {
    try {
      const { user } = await getUserById(userId);
      return user ?? null;
    } catch {
      return null;
    }
  },
);

/** 複数ユーザーをまとめて取得し、user_id をキーにしたMapで返す */
export async function getUsersByIds(
  userIds: number[],
): Promise<Map<number, SwaggerUserDetail>> {
  const uniqueIds = [...new Set(userIds)];
  const users = await Promise.all(uniqueIds.map(getUserDetail));

  const usersById = new Map<number, SwaggerUserDetail>();
  uniqueIds.forEach((id, index) => {
    const user = users[index];
    if (user) usersById.set(id, user);
  });

  return usersById;
}
