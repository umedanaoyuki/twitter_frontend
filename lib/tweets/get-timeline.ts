import { getUserById } from "@/lib/api/users";
import { getUserTweets } from "@/lib/api/tweets";
import { getCurrentUserId } from "@/lib/session";
import type { TweetTimelineData } from "@/lib/types/tweet";
import { mapApiTweetsToTimelineTweets } from "@/lib/tweets/map-tweet";

export async function getHomeTimeline(
  options?: { cursor?: number; limit?: number },
): Promise<TweetTimelineData | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const [userResponse, tweetsResponse] = await Promise.all([
    getUserById(userId),
    getUserTweets(userId, options),
  ]);

  const user = userResponse.user;
  if (!user?.email) {
    throw new Error("ユーザー情報の取得に失敗しました");
  }

  return {
    tweets: mapApiTweetsToTimelineTweets(tweetsResponse.tweets ?? [], user),
    hasMore: tweetsResponse.has_more ?? false,
    nextCursor: tweetsResponse.next_cursor ?? null,
  };
}
