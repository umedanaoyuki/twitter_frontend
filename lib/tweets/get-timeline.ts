import { getAllTweets } from "@/lib/api/tweets";
import { getSessionCookieHeader } from "@/lib/session";
import type { TweetTimelineData } from "@/lib/types/tweet";
import { mapApiTweetsToTimelineTweets } from "@/lib/tweets/map-tweet";
import { getCurrentUserId } from "@/lib/users/get-current-user";
import { getUsersByIds } from "@/lib/users/get-user-detail";

/**
 * ホームのタイムラインを取得する。
 * GET /tweets は登録されている全ユーザーのツイートを返すので、
 * 投稿者名の表示に必要なユーザー情報は user_id ごとに別途取得する。
 */
export async function getHomeTimeline(options?: {
  cursor?: number;
  limit?: number;
}): Promise<TweetTimelineData | null> {
  const cookieHeader = await getSessionCookieHeader();
  if (!cookieHeader) return null;

  const [response, currentUserId] = await Promise.all([
    getAllTweets(options),
    getCurrentUserId(),
  ]);

  const apiTweets = response.tweets ?? [];
  const authorIds = apiTweets
    .map((apiTweet) => apiTweet.user_id)
    .filter((userId): userId is number => userId != null);
  const usersById = await getUsersByIds(authorIds);

  return {
    tweets: mapApiTweetsToTimelineTweets(apiTweets, usersById),
    hasMore: response.has_more ?? false,
    nextCursor: response.next_cursor ?? null,
    currentUserId,
  };
}
