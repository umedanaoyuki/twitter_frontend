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
  /** 投稿者のアイコンURL。未設定なら省略する */
  avatarUrl?: string,
  options?: {
    /** ログイン中のユーザーがリツイート済みかどうか */
    isRetweeted?: boolean;
    /** ログイン中のユーザーがブックマーク済みかどうか */
    isBookmarked?: boolean;
    /** リツイートとして並べる場合の、リツイートした人の表示名 */
    retweetedBy?: string;
  },
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
      avatarUrl,
    },
    content: apiTweet.content ?? "",
    imageUrl: apiTweet.image_url || undefined,
    timestamp: formatRelativeTime(createdAt),
    createdAt,
    retweetCount: apiTweet.retweet_count ?? 0,
    isRetweeted: options?.isRetweeted ?? false,
    isBookmarked: options?.isBookmarked ?? false,
    retweetedBy: options?.retweetedBy,
    stats: {
      replies: "0",
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
  options?: {
    /** user_id をキーにした投稿者のアイコンURL */
    avatarUrlsById?: Map<number, string>;
    /** ログイン中のユーザーがリツイート済みのツイートID */
    retweetedTweetIds?: Set<number>;
    /** ログイン中のユーザーがブックマーク済みのツイートID */
    bookmarkedTweetIds?: Set<number>;
    /** リツイートとして並べる場合の、リツイートした人の表示名（全件に付与する） */
    retweetedBy?: string;
  },
): Tweet[] {
  return apiTweets.map((apiTweet) =>
    mapApiTweetToTweet(
      apiTweet,
      apiTweet.user_id != null ? usersById.get(apiTweet.user_id) : null,
      apiTweet.user_id != null
        ? options?.avatarUrlsById?.get(apiTweet.user_id)
        : undefined,
      {
        isRetweeted:
          apiTweet.id != null &&
          (options?.retweetedTweetIds?.has(apiTweet.id) ?? false),
        isBookmarked:
          apiTweet.id != null &&
          (options?.bookmarkedTweetIds?.has(apiTweet.id) ?? false),
        retweetedBy: options?.retweetedBy,
      },
    ),
  );
}
