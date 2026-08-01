"use client";

import { useState } from "react";

import { CommentList } from "@/components/home/comment-list";
import { TweetCard } from "@/components/home/tweet-card";
import type { Comment } from "@/lib/types/comment";
import type { TweetDetail } from "@/lib/tweets/get-tweet-detail";

type TweetDetailContentProps = {
  tweetDetail: TweetDetail;
  /** ログイン中のユーザーID。投稿者と一致するときだけ削除メニューを表示する */
  currentUserId?: number | null;
};

/**
 * 詳細画面の「ツイート + コメント一覧」。
 * モーダルから投稿されたコメントを即座に一覧へ反映するため、Client Componentで状態を持つ。
 */
function TweetDetailContent({
  tweetDetail,
  currentUserId,
}: TweetDetailContentProps) {
  const { tweet, commentList } = tweetDetail;
  const [postedComments, setPostedComments] = useState<Comment[]>([]);

  return (
    <>
      <TweetCard
        tweet={tweet}
        currentUserId={currentUserId}
        redirectAfterDelete="/home"
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
