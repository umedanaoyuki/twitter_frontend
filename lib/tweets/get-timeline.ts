import { getUserById } from "@/lib/api/users";
import { getUserTweets } from "@/lib/api/tweets";
import { getCurrentUserId } from "@/lib/session";
import type { TweetTimelineData } from "@/lib/types/tweet";
import type { CurrentUser } from "@/lib/types/user";
import { emailToDisplayName } from "@/lib/tweets/format";
import { mapApiTweetsToTimelineTweets } from "@/lib/tweets/map-tweet";

export type HomeTimelineResult = TweetTimelineData & {
  currentUser: CurrentUser;
};

export async function getHomeTimeline(
  options?: { cursor?: number; limit?: number },
): Promise<HomeTimelineResult | null> {
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

  const handle = emailToDisplayName(user.email);

  return {
    tweets: mapApiTweetsToTimelineTweets(tweetsResponse.tweets ?? [], user),
    hasMore: tweetsResponse.has_more ?? false,
    nextCursor: tweetsResponse.next_cursor ?? null,
    currentUser: {
      name: handle,
      handle,
    },
  };
}
