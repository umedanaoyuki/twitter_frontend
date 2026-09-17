"use client";

import { useState, useTransition } from "react";
import type { MouseEvent } from "react";
import { toast } from "sonner";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

import { toggleBookmarkAction } from "@/app/home/action";
import { ToastMessage } from "@/components/utils/toast-message";
import { cn } from "@/lib/utils";

type BookmarkButtonProps = {
  tweetId: string;
  /** サーバーから受け取ったブックマーク済みかどうか */
  bookmarked: boolean;
};

function BookmarkButton({ tweetId, bookmarked }: BookmarkButtonProps) {
  // サーバーの再検証を待たずに見た目を切り替える（失敗時は元に戻す）
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [isPending, startTransition] = useTransition();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    // カード全体のクリック（詳細への遷移）を発火させない
    event.stopPropagation();
    if (isPending) return;

    const nextBookmarked = !isBookmarked;
    setIsBookmarked(nextBookmarked);

    startTransition(async () => {
      const result = await toggleBookmarkAction(tweetId, nextBookmarked);

      if ("error" in result) {
        setIsBookmarked(!nextBookmarked);
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
        isBookmarked ? "ブックマークを削除する" : "ブックマークに追加する"
      }
      aria-pressed={isBookmarked}
      disabled={isPending}
      onClick={handleClick}
      className={cn(
        "group flex items-center transition-colors disabled:cursor-not-allowed",
        isBookmarked ? "text-[#1d9bf0]" : "text-[#71767b] hover:text-[#1d9bf0]",
      )}
    >
      <span className="flex size-[34px] items-center justify-center rounded-full transition-colors group-hover:bg-[#1d9bf0]/10">
        {/* ブックマーク済みは塗りつぶし、未登録は枠線のアイコンで区別する */}
        {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
      </span>
    </button>
  );
}

export { BookmarkButton };
