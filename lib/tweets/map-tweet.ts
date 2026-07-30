import type { ApiTweet, SwaggerUserDetail } from "@/lib/api/types";
import type { Tweet } from "@/lib/types/tweet";
import {
  emailToDisplayName,
  formatCount,
  formatRelativeTime,
} from "@/lib/tweets/format";

export function mapApiTweetToTweet(
  apiTweet: ApiTweet,
  /** 投稿者の情報。取得できなかった場合は user{user_id} を表示名にフォールバックする */
  user?: SwaggerUserDetail | null,
): Tweet {
  const email = user?.email ?? `user${apiTweet.user_id ?? ""}`;
  const displayName = emailToDisplayName(email);
  const createdAt = apiTweet.created_at ?? new Date().toISOString();

  return {
    id: String(apiTweet.id ?? ""),
    authorId: apiTweet.user_id ?? null,
    author: {
      name: displayName,
      handle: displayName,
    },
    content: apiTweet.content ?? "",
    imageUrl: apiTweet.image_url || undefined,
    timestamp: formatRelativeTime(createdAt),
    createdAt,
    commentCount: apiTweet.comment_count ?? 0,
    stats: {
      reposts: formatCount(apiTweet.retweet_count ?? 0),
      likes: formatCount(apiTweet.like_count ?? 0),
      views: "0",
    },
  };
}

/**
 * タイムライン用に複数ツイートを変換する。
 * 投稿者はツイートごとに異なるため、user_id をキーにしたユーザー情報を受け取る。
 */
export function mapApiTweetsToTimelineTweets(
  apiTweets: ApiTweet[],
  usersById: Map<number, SwaggerUserDetail>,
): Tweet[] {
  return apiTweets.map((apiTweet) =>
    mapApiTweetToTweet(
      apiTweet,
      apiTweet.user_id != null ? usersById.get(apiTweet.user_id) : null,
    ),
  );
}
