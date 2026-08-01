"use client";

import { useState, useTransition } from "react";
import type { MouseEvent } from "react";
import { toast } from "sonner";
import { CiRepeat } from "react-icons/ci";

import { toggleRetweetAction } from "@/app/home/action";
import { ToastMessage } from "@/components/utils/toast-message";
import { formatCount } from "@/lib/tweets/format";
import { cn } from "@/lib/utils";

type RetweetButtonProps = {
  tweetId: string;
  /** サーバーから受け取ったリツイート数 */
  count: number;
  /** サーバーから受け取ったリツイート済みかどうか */
  retweeted: boolean;
};

function RetweetButton({ tweetId, count, retweeted }: RetweetButtonProps) {
  // サーバーの再検証を待たずに見た目を切り替える（失敗時は元に戻す）
  const [isRetweeted, setIsRetweeted] = useState(retweeted);
  const [retweetCount, setRetweetCount] = useState(count);
  const [isPending, startTransition] = useTransition();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    // カード全体のクリック（詳細への遷移）を発火させない
    event.stopPropagation();
    if (isPending) return;

    const nextRetweeted = !isRetweeted;
    setIsRetweeted(nextRetweeted);
    setRetweetCount((current) =>
      nextRetweeted ? current + 1 : Math.max(current - 1, 0),
    );

    startTransition(async () => {
      const result = await toggleRetweetAction(tweetId, nextRetweeted);

      if ("error" in result) {
        setIsRetweeted(!nextRetweeted);
        setRetweetCount((current) =>
          nextRetweeted ? Math.max(current - 1, 0) : current + 1,
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
        isRetweeted
          ? `リポストを取り消す リポスト ${retweetCount}件`
          : `リポストする リポスト ${retweetCount}件`
      }
      aria-pressed={isRetweeted}
      disabled={isPending}
      onClick={handleClick}
      className={cn(
        "group flex items-center gap-1 transition-colors disabled:cursor-not-allowed",
        isRetweeted ? "text-[#00ba7c]" : "text-[#71767b] hover:text-[#00ba7c]",
      )}
    >
      <span className="flex size-[34px] items-center justify-center rounded-full transition-colors group-hover:bg-[#00ba7c]/10">
        <CiRepeat />
      </span>
      <span className="min-w-[1ch] text-[13px] tabular-nums">
        {formatCount(retweetCount)}
      </span>
    </button>
  );
}

export { RetweetButton };
