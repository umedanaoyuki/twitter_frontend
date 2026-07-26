import { notFound } from "next/navigation";

import { getTweet } from "@/lib/api/tweets";
import { getUserById } from "@/lib/api/users";
import { getTweetComments } from "@/lib/comments/get-comments";
import { mapApiTweetToTweet } from "@/lib/tweets/map-tweet";
import type { CommentListData } from "@/lib/types/comment";
import type { Tweet } from "@/lib/types/tweet";

export type TweetDetail = {
  tweet: Tweet;
  commentList: CommentListData;
};

export async function getTweetDetail(id: string): Promise<TweetDetail> {
  const tweetId = Number(id);
  if (!Number.isInteger(tweetId)) {
    notFound();
  }

  const [response, commentList] = await Promise.all([
    getTweet(tweetId),
    getTweetComments(tweetId),
  ]);
  const tweet = response?.tweet;

  if (!tweet) {
    notFound();
  }

  const { user } = await getUserById(tweet.user_id ?? 0);
  if (!user) {
    throw new Error("ユーザー情報の取得に失敗しました");
  }

  return {
    tweet: mapApiTweetToTweet(tweet, user),
    commentList,
  };
}
