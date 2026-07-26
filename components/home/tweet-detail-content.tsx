"use client";

import { useState } from "react";

import { CommentList } from "@/components/home/comment-list";
import { TweetCard } from "@/components/home/tweet-card";
import type { Comment, CommentListData } from "@/lib/types/comment";
import type { Tweet } from "@/lib/types/tweet";

type TweetDetailContentProps = {
  tweet: Tweet;
  commentList: CommentListData;
};

/**
 * 詳細画面の「ツイート + コメント一覧」。
 * モーダルから投稿されたコメントを即座に一覧へ反映するため、Client Componentで状態を持つ。
 */
function TweetDetailContent({ tweet, commentList }: TweetDetailContentProps) {
  const [postedComments, setPostedComments] = useState<Comment[]>([]);

  return (
    <>
      <TweetCard
        tweet={tweet}
        onCommented={(comment) =>
          setPostedComments((current) => [comment, ...current])
        }
      />

      <section aria-label="返信一覧">
        <CommentList
          tweetId={tweet.id}
          initialData={commentList}
          postedComments={postedComments}
        />
      </section>
    </>
  );
}

export { TweetDetailContent };
