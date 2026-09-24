import { cache } from "react";

import { getUserFollowing } from "@/lib/api/users";
import { getCurrentUserId } from "@/lib/users/get-current-user";

const PAGE_LIMIT = 100;
/** フォローが極端に多いユーザーでもリクエストが際限なく増えないようにする上限 */
const MAX_PAGES = 5;

/**
 * ログイン中のユーザーがフォローしているユーザーIDを取得する。
 *
 * バックエンドのユーザー取得APIは「自分がフォロー済みか」を返さないため、
 * フォロー中一覧から突き合わせている。
 *
 * ボタンの表示に使うだけの情報なので、取得に失敗しても例外は投げず、
 * そこまでに取れた分を返す。
 * cache() で包んでいるので、同じリクエスト内で何度呼んでもAPIアクセスは1回だけ。
 */
export const getFollowingUserIds = cache(async (): Promise<Set<number>> => {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return new Set();

  const followingUserIds = new Set<number>();

  try {
    let cursor: number | undefined;

    for (let page = 0; page < MAX_PAGES; page++) {
      const response = await getUserFollowing(currentUserId, {
        cursor,
        limit: PAGE_LIMIT,
      });

      for (const follow of response.following ?? []) {
        if (follow.followed_user_id != null) {
          followingUserIds.add(follow.followed_user_id);
        }
      }

      if (!response.has_more || response.next_cursor == null) break;
      cursor = response.next_cursor;
    }
  } catch {
    return followingUserIds;
  }

  return followingUserIds;
});
