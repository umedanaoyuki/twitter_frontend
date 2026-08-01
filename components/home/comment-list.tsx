"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { loadMoreCommentsAction } from "@/app/tweets/action";
import { CommentCard } from "@/components/home/comment-card";
import type { Comment, CommentListData } from "@/lib/types/comment";

type CommentListProps = {
  tweetId: string;
  initialData: CommentListData;
  /** モーダルから投稿された直後のコメント（サーバー再取得を待たずに表示する） */
  postedComments?: Comment[];
};

function CommentList({
  tweetId,
  initialData,
  postedComments = [],
}: CommentListProps) {
  const [extraComments, setExtraComments] = useState<Comment[]>([]);
  const [extraHasMore, setExtraHasMore] = useState<boolean | null>(null);
  const [extraNextCursor, setExtraNextCursor] = useState<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const hasMore = extraHasMore ?? initialData.hasMore;
  const nextCursor = extraNextCursor ?? initialData.nextCursor;

  // 投稿直後のコメントとサーバーから取得したコメントが重複しないよう、IDで一意にする
  const comments = [
    ...postedComments,
    ...initialData.comments,
    ...extraComments,
  ].filter(
    (comment, index, all) =>
      all.findIndex((target) => target.id === comment.id) === index,
  );

  const handleLoadMore = useCallback(() => {
    if (!nextCursor || isLoadingRef.current) return;

    isLoadingRef.current = true;

    void (async () => {
      try {
        const result = await loadMoreCommentsAction(tweetId, nextCursor);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        setExtraComments((current) => [...current, ...result.comments]);
        setExtraHasMore(result.hasMore);
        setExtraNextCursor(result.nextCursor);
      } finally {
        isLoadingRef.current = false;
      }
    })();
  }, [tweetId, nextCursor]);

  useEffect(() => {
    if (!hasMore || nextCursor == null) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "1px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, nextCursor, handleLoadMore]);

  if (comments.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-[15px] text-[#71767b]">
        まだ返信がありません
      </p>
    );
  }

  return (
    <>
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
      {hasMore && nextCursor !== null && (
        <div
          ref={loadMoreRef}
          className="border-b border-[#2f3336] px-4 py-4 text-center"
          aria-live="polite"
        >
          <p className="text-[15px] font-bold text-[#1d9bf0]">読み込み中...</p>
        </div>
      )}
    </>
  );
}

export { CommentList };
