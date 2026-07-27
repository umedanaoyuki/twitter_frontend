import { getCurrentUserTweets } from "@/lib/api/tweets";
import { getProfileImageUrl } from "@/lib/profile/get-profile";
import { getSessionCookieHeader } from "@/lib/session";
import type { TweetTimelineData } from "@/lib/types/tweet";
import { mapApiTweetsToTimelineTweets } from "@/lib/tweets/map-tweet";

export async function getHomeTimeline(options?: {
  cursor?: number;
  limit?: number;
}): Promise<TweetTimelineData | null> {
  const cookieHeader = await getSessionCookieHeader();
  if (!cookieHeader) return null;

  const response = await getCurrentUserTweets(options);

  const user = response.user;
  if (!user?.id || !user?.email) {
    throw new Error("ユーザー情報の取得に失敗しました");
  }

  // ホームは自分の投稿のみのため、プロフィール画像は1回の取得で全件に使える
  const avatarUrl = await getProfileImageUrl(user.id);

  return {
    tweets: mapApiTweetsToTimelineTweets(
      response.tweets ?? [],
      user,
      avatarUrl,
    ),
    hasMore: response.has_more ?? false,
    nextCursor: response.next_cursor ?? null,
    viewerAvatarUrl: avatarUrl,
  };
}
