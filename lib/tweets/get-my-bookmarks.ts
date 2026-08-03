import { cache } from "react";

import { getBookmarks } from "@/lib/api/tweets";
import { getSessionCookieHeader } from "@/lib/session";

/**
 * ログイン中のユーザーがブックマーク済みのツイートIDを取得する。
 *
 * バックエンドのツイート取得APIは「自分がブックマーク済みか」を返さないため、
 * ブックマーク一覧から突き合わせている。
 * （ツイート側に is_bookmarked のようなフィールドが増えたら、そちらに寄せるのが望ましい）
 *
 * ボタンの表示に使うだけの情報なので、取得に失敗しても例外は投げず空集合を返す。
 * cache() で包んでいるので、同じリクエスト内で何度呼んでもAPIアクセスは1回だけ。
 */
export const getBookmarkedTweetIds = cache(async (): Promise<Set<number>> => {
  const cookieHeader = await getSessionCookieHeader();
  if (!cookieHeader) return new Set();

  try {
    const bookmarks = await getBookmarks();

    return new Set(
      bookmarks
        .map((bookmark) => bookmark.tweet_id)
        .filter((tweetId): tweetId is number => tweetId != null),
    );
  } catch {
    return new Set();
  }
});
