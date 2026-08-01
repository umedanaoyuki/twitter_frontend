import { getUserLikes } from "@/lib/api/tweets";
import type { ApiTweet } from "@/lib/api/types";
import { getAvatarUrlsByIds } from "@/lib/profile/get-profile";
import { getRetweetedTweetIds } from "@/lib/tweets/get-my-retweets";
import { mapApiTweetsToTimelineTweets } from "@/lib/tweets/map-tweet";
import type { TweetTimelineData } from "@/lib/types/tweet";
import { getCurrentUserId } from "@/lib/users/get-current-user";
import { getUsersByIds } from "@/lib/users/get-user-detail";

/**
 * ログイン中のユーザーがいいねしたツイート一覧を取得する。
 * 未ログインの場合は null を返す。
 *
 * いいねした相手は自分とは限らないため、投稿者名とアイコンは user_id ごとに別途取得する。
 */
export async function getMyLikedTimeline(options?: {
  cursor?: number;
  limit?: number;
}): Promise<TweetTimelineData | null> {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  const response = await getUserLikes(currentUserId, options);
  const apiTweets = (response.likes ?? [])
    .map((like) => like.tweet)
    .filter((tweet): tweet is ApiTweet => tweet != null);

  const authorIds = apiTweets
    .map((apiTweet) => apiTweet.user_id)
    .filter((userId): userId is number => userId != null);

  const [usersById, avatarUrlsById, retweetedTweetIds] = await Promise.all([
    getUsersByIds(authorIds),
    getAvatarUrlsByIds(authorIds),
    getRetweetedTweetIds(),
  ]);

  return {
    tweets: mapApiTweetsToTimelineTweets(apiTweets, usersById, {
      avatarUrlsById,
      retweetedTweetIds,
      // 一覧に並ぶのはすべて自分がいいね済みのツイート
      likedTweetIds: new Set(
        apiTweets
          .map((apiTweet) => apiTweet.id)
          .filter((id): id is number => id != null),
      ),
    }),
    hasMore: response.has_more ?? false,
    nextCursor: response.next_cursor ?? null,
    currentUserId,
  };
}
