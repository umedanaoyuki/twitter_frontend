import { cache } from "react";

import { getUserLikes } from "@/lib/api/tweets";
import { getCurrentUserId } from "@/lib/users/get-current-user";

const PAGE_LIMIT = 100;
/** いいねが極端に多いユーザーでもリクエストが際限なく増えないようにする上限 */
const MAX_PAGES = 5;

/**
 * ログイン中のユーザーがいいね済みのツイートIDを取得する。
 *
 * バックエンドのツイート取得APIは「自分がいいね済みか」を返さないため、
 * いいね一覧から突き合わせている。
 *
 * ボタンの表示に使うだけの情報なので、取得に失敗しても例外は投げず、
 * そこまでに取れた分を返す。
 * cache() で包んでいるので、同じリクエスト内で何度呼んでもAPIアクセスは1回だけ。
 */
export const getLikedTweetIds = cache(async (): Promise<Set<number>> => {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return new Set();

  const likedTweetIds = new Set<number>();

  try {
    let cursor: number | undefined;

    for (let page = 0; page < MAX_PAGES; page++) {
      const response = await getUserLikes(currentUserId, {
        cursor,
        limit: PAGE_LIMIT,
      });

      for (const item of response.likes ?? []) {
        if (item.tweet?.id != null) {
          likedTweetIds.add(item.tweet.id);
        }
      }

      if (!response.has_more || response.next_cursor == null) break;
      cursor = response.next_cursor;
    }
  } catch {
    return likedTweetIds;
  }

  return likedTweetIds;
});
