import type { ApiTweet, SwaggerUserDetail } from "@/lib/api/types";
import type { Tweet } from "@/lib/types/tweet";
import {
  emailToDisplayName,
  formatCount,
  formatRelativeTime,
} from "@/lib/tweets/format";

export function mapApiTweetToTweet(
  apiTweet: ApiTweet,
  user: SwaggerUserDetail,
): Tweet {
  const email = user.email ?? `user${apiTweet.user_id ?? ""}`;
  const displayName = emailToDisplayName(email);
  const createdAt = apiTweet.created_at ?? new Date().toISOString();

  return {
    id: String(apiTweet.id ?? ""),
    author: {
      name: displayName,
      handle: displayName,
    },
    content: apiTweet.content ?? "",
    imageUrl: apiTweet.image_url || undefined,
    timestamp: formatRelativeTime(createdAt),
    createdAt,
    stats: {
      replies: "0",
      reposts: formatCount(apiTweet.retweet_count ?? 0),
      likes: formatCount(apiTweet.like_count ?? 0),
      views: "0",
    },
  };
}

export function mapApiTweetsToTimelineTweets(
  apiTweets: ApiTweet[],
  user: SwaggerUserDetail,
): Tweet[] {
  return apiTweets.map((apiTweet) => mapApiTweetToTweet(apiTweet, user));
}
