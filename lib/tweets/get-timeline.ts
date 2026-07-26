import { getCurrentUserTweets } from "@/lib/api/tweets";
import { getSessionCookieHeader } from "@/lib/session";
import type { TweetTimelineData } from "@/lib/types/tweet";
import { mapApiTweetsToTimelineTweets } from "@/lib/tweets/map-tweet";

export async function getHomeTimeline(
  options?: { cursor?: number; limit?: number },
): Promise<TweetTimelineData | null> {
  const cookieHeader = await getSessionCookieHeader();
  if (!cookieHeader) return null;

  const response = await getCurrentUserTweets(options);

  const user = response.user;
  if (!user?.email) {
    throw new Error("ユーザー情報の取得に失敗しました");
  }

  return {
    tweets: mapApiTweetsToTimelineTweets(response.tweets ?? [], user),
    hasMore: response.has_more ?? false,
    nextCursor: response.next_cursor ?? null,
    // /user/tweets が返す user はログイン中のユーザー自身
    currentUserId: user.id ?? null,
  };
}
