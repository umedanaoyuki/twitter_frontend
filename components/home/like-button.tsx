"use client";

import { useState, useTransition } from "react";
import type { MouseEvent } from "react";
import { toast } from "sonner";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

import { toggleLikeAction } from "@/app/home/action";
import { ToastMessage } from "@/components/utils/toast-message";
import { formatCount } from "@/lib/tweets/format";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  tweetId: string;
  /** サーバーから受け取ったいいね数 */
  count: number;
  /** サーバーから受け取ったいいね済みかどうか */
  liked: boolean;
};

function LikeButton({ tweetId, count, liked }: LikeButtonProps) {
  // サーバーの再検証を待たずに見た目を切り替える（失敗時は元に戻す）
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(count);
  const [isPending, startTransition] = useTransition();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    // カード全体のクリック（詳細への遷移）を発火させない
    event.stopPropagation();
    if (isPending) return;

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikeCount((current) =>
      nextLiked ? current + 1 : Math.max(current - 1, 0),
    );

    startTransition(async () => {
      const result = await toggleLikeAction(tweetId, nextLiked);

      if ("error" in result) {
        setIsLiked(!nextLiked);
        setLikeCount((current) =>
          nextLiked ? Math.max(current - 1, 0) : current + 1,
        );
        toast.error(result.error);
        return;
      }

      toast.success(<ToastMessage message={result.message} />);
    });
  }

  return (
    <button
      type="button"
      aria-label={
        isLiked
          ? `いいねを取り消す いいね ${likeCount}件`
          : `いいねする いいね ${likeCount}件`
      }
      aria-pressed={isLiked}
      disabled={isPending}
      onClick={handleClick}
      className={cn(
        "group flex items-center gap-1 transition-colors disabled:cursor-not-allowed",
        isLiked ? "text-[#f91880]" : "text-[#71767b] hover:text-[#f91880]",
      )}
    >
      <span className="flex size-[34px] items-center justify-center rounded-full transition-colors group-hover:bg-[#f91880]/10">
        {isLiked ? <IoMdHeart /> : <IoMdHeartEmpty />}
      </span>
      <span className="min-w-[1ch] text-[13px] tabular-nums">
        {formatCount(likeCount)}
      </span>
    </button>
  );
}

export { LikeButton };
