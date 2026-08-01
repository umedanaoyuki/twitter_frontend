import { getAllTweets } from "@/lib/api/tweets";
import { getSessionCookieHeader } from "@/lib/session";
import type { TweetTimelineData } from "@/lib/types/tweet";
import { emailToDisplayName } from "@/lib/tweets/format";
import {
  getMyRetweets,
  getRetweetedTweetIds,
} from "@/lib/tweets/get-my-retweets";
import { mapApiTweetsToTimelineTweets } from "@/lib/tweets/map-tweet";
import { getCurrentUser } from "@/lib/users/get-current-user";
import { getUsersByIds } from "@/lib/users/get-user-detail";

/** タイムライン先頭にまとめて差し込むリツイートの最大件数 */
const PINNED_RETWEET_LIMIT = 20;

/**
 * ホームのタイムラインを取得する。
 * GET /tweets は登録されている全ユーザーのツイートを返すので、
 * 投稿者名の表示に必要なユーザー情報は user_id ごとに別途取得する。
 *
 * リツイートしたツイートは、リツイートした順（新しい順）で先頭ページの最上部に並べる。
 * バックエンドの GET /tweets はリツイートを1件の投稿として返さないため、
 * リツイート一覧を別途取得してフロント側で合成している。
 */
export async function getHomeTimeline(options?: {
  cursor?: number;
  limit?: number;
}): Promise<TweetTimelineData | null> {
  const cookieHeader = await getSessionCookieHeader();
  if (!cookieHeader) return null;

  const [response, currentUser, myRetweets, retweetedTweetIds] =
    await Promise.all([
      getAllTweets(options),
      getCurrentUser(),
      getMyRetweets(),
      getRetweetedTweetIds(),
    ]);

  const pinnedRetweets = myRetweets.slice(0, PINNED_RETWEET_LIMIT);
  const pinnedRetweetIds = new Set(
    pinnedRetweets
      .map((apiTweet) => apiTweet.id)
      .filter((id): id is number => id != null),
  );

  // 先頭に出す分は通常の並びから取り除いて、同じポストが二重に出ないようにする
  const apiTweets = (response.tweets ?? []).filter(
    (apiTweet) => apiTweet.id == null || !pinnedRetweetIds.has(apiTweet.id),
  );

  // 2ページ目以降は先頭ページで出し切っているので差し込まない
  const isFirstPage = options?.cursor == null;
  const authorIds = [...(isFirstPage ? pinnedRetweets : []), ...apiTweets]
    .map((apiTweet) => apiTweet.user_id)
    .filter((userId): userId is number => userId != null);
  const usersById = await getUsersByIds(authorIds);

  const retweetedBy = currentUser?.email
    ? emailToDisplayName(currentUser.email)
    : "あなた";
  const pinnedTweets = isFirstPage
    ? mapApiTweetsToTimelineTweets(pinnedRetweets, usersById, {
        retweetedTweetIds,
        retweetedBy,
      })
    : [];

  return {
    tweets: [
      ...pinnedTweets,
      ...mapApiTweetsToTimelineTweets(apiTweets, usersById, {
        retweetedTweetIds,
      }),
    ],
    hasMore: response.has_more ?? false,
    nextCursor: response.next_cursor ?? null,
    currentUserId: currentUser?.id ?? null,
  };
}
