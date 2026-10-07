import { cache } from "react";

import { getNotificationCount } from "@/lib/api/notifications";
import { getSessionCookieHeader } from "@/lib/session";

/**
 * ログイン中のユーザー宛の未読通知件数を取得する。
 *
 * バッジの表示に使うだけの情報なので、未ログインや取得失敗時は例外を投げず 0 を返す。
 * cache() で包んでいるので、同じリクエスト内で何度呼んでもAPIアクセスは1回だけ。
 */
export const getUnreadNotificationCount = cache(async (): Promise<number> => {
  const cookieHeader = await getSessionCookieHeader();
  if (!cookieHeader) return 0;

  try {
    const response = await getNotificationCount();
    return response.unread_count ?? 0;
  } catch {
    return 0;
  }
});
