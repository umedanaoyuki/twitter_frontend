import { cache } from "react";

import { getGroups } from "@/lib/api/groups";
import { mapApiGroupsToGroups } from "@/lib/messages/map-group";
import { getSessionCookieHeader } from "@/lib/session";
import type { Group } from "@/lib/types/message";

/**
 * ログイン中のユーザーが所属するグループ一覧を取得する。
 * 未ログインの場合は null を返す。
 *
 * グループ詳細画面でもグループ名の解決に使うため、cache() で包んで
 * 同一リクエスト内の重複アクセスを1回にまとめている。
 */
export const getMyGroups = cache(async (): Promise<Group[] | null> => {
  const cookieHeader = await getSessionCookieHeader();
  if (!cookieHeader) return null;

  const apiGroups = await getGroups();
  return mapApiGroupsToGroups(apiGroups);
});

/**
 * 所属グループの中から id が一致するものを返す。
 * グループ単体を返すAPIが無いため、一覧から引いている。
 */
export async function findMyGroup(groupId: number): Promise<Group | null> {
  const groups = await getMyGroups();
  if (!groups) return null;

  return groups.find((group) => group.id === String(groupId)) ?? null;
}
