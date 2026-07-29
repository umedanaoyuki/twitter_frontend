import { cache } from "react";

import { getCurrentUserTweets } from "@/lib/api/tweets";
import type { SwaggerUserDetail } from "@/lib/api/types";
import { getSessionCookieHeader } from "@/lib/session";

/**
 * ログイン中のユーザーを取得する。未ログインまたは取得失敗時は null。
 *
 * バックエンドに「現在のユーザー」を返す専用APIが無いため、
 * 認証必須の GET /user/tweets のレスポンスに含まれる user から取り出している。
 * ツイート本体は不要なので limit: 1 で最小限に抑えている。
 * （バックエンドに GET /me のようなAPIが増えたら、そちらに差し替えるのが望ましい）
 *
 * cache() で包んでいるので、同じリクエスト内で何度呼んでもAPIアクセスは1回だけ。
 */
export const getCurrentUser = cache(
  async (): Promise<SwaggerUserDetail | null> => {
    const cookieHeader = await getSessionCookieHeader();
    if (!cookieHeader) return null;

    try {
      const response = await getCurrentUserTweets({ limit: 1 });
      return response.user ?? null;
    } catch {
      return null;
    }
  },
);

/** ログイン中のユーザーID。未ログインまたは取得失敗時は null */
export const getCurrentUserId = cache(async (): Promise<number | null> => {
  const user = await getCurrentUser();
  return user?.id ?? null;
});
