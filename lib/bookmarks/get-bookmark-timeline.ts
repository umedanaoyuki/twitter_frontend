import { getBookmarks, getTweet } from "@/lib/api/tweets";
import type { ApiBookmark, ApiTweet } from "@/lib/api/types";
import { getSessionCookieHeader } from "@/lib/session";
import { getRetweetedTweetIds } from "@/lib/tweets/get-my-retweets";
import { mapApiTweetsToTimelineTweets } from "@/lib/tweets/map-tweet";
import type { TweetTimelineData } from "@/lib/types/tweet";
import { getCurrentUser } from "@/lib/users/get-current-user";
import { getUsersByIds } from "@/lib/users/get-user-detail";

/**
 * 1画面に表示するブックマークの最大件数。
 * 一覧APIはページングが無く、ツイート本体は1件ずつ取りに行く必要があるため、
 * ブックマークが多いユーザーでもリクエストが際限なく増えないように上限を設けている。
 */
const MAX_BOOKMARKS = 50;

/** ブックマークした順（新しい順）に並べる */
function sortByBookmarkedAtDesc(bookmarks: ApiBookmark[]): ApiBookmark[] {
  return [...bookmarks].sort((a, b) => {
    const timeDiff =
      new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime();
    if (timeDiff !== 0) return timeDiff;

    // created_at が同秒で並んだ場合は、後から作られたレコードを先に出す
    return (b.id ?? 0) - (a.id ?? 0);
  });
}

/**
 * ログイン中のユーザーのブックマーク一覧を取得する。
 * 未ログインの場合は null を返す。
 *
 * GET /tweets/bookmarks は tweet_id と本文しか返さないため、
 * 表示に必要なツイート本体は tweet_id ごとに GET /tweets/{id} で引き直し、
 * 投稿者名は user_id ごとに別途取得している。
 */
export async function getBookmarkTimeline(): Promise<TweetTimelineData | null> {
  const cookieHeader = await getSessionCookieHeader();
  if (!cookieHeader) return null;

  const [bookmarks, currentUser, retweetedTweetIds] = await Promise.all([
    getBookmarks(),
    getCurrentUser(),
    getRetweetedTweetIds(),
  ]);

  const bookmarkedTweetIds = [
    ...new Set(
      sortByBookmarkedAtDesc(bookmarks)
        .map((bookmark) => bookmark.tweet_id)
        .filter((tweetId): tweetId is number => tweetId != null),
    ),
  ].slice(0, MAX_BOOKMARKS);

  const responses = await Promise.all(
    // 1件の取得失敗で一覧全体を落とさない
    bookmarkedTweetIds.map((tweetId) => getTweet(tweetId).catch(() => null)),
  );
  // 削除済みのツイート（404）はブックマークが残っていても表示できないので除く
  const apiTweets = responses
    .map((response) => response?.tweet)
    .filter((tweet): tweet is ApiTweet => tweet != null);

  const authorIds = apiTweets
    .map((apiTweet) => apiTweet.user_id)
    .filter((userId): userId is number => userId != null);
  const usersById = await getUsersByIds(authorIds);

  return {
    tweets: mapApiTweetsToTimelineTweets(apiTweets, usersById, {
      retweetedTweetIds,
      // 一覧に並ぶのはすべてブックマーク済みのツイート
      bookmarkedTweetIds: new Set(bookmarkedTweetIds),
    }),
    // 一覧APIにページングが無いため、続きの読み込みは行わない
    hasMore: false,
    nextCursor: null,
    currentUserId: currentUser?.id ?? null,
  };
}
