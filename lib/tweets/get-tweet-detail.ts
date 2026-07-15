import { notFound } from "next/navigation";

import { getTweet } from "@/lib/api/tweets";
import { getUserById } from "@/lib/api/users";
import { mapApiTweetToTweet } from "@/lib/tweets/map-tweet";
import type { Tweet } from "@/lib/types/tweet";

export async function getTweetDetail(id: string): Promise<Tweet> {
  const tweetId = Number(id);
  if (!Number.isInteger(tweetId)) {
    notFound();
  }

  const response = await getTweet(tweetId);
  const tweet = response?.tweet;

  if (!tweet) {
    notFound();
  }

  const { user } = await getUserById(tweet.user_id ?? 0);
  if (!user) {
    throw new Error("ユーザー情報の取得に失敗しました");
  }

  return mapApiTweetToTweet(tweet, user);
}
