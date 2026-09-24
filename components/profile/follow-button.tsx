"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { toggleFollowAction } from "@/app/profile/action";
import { ToastMessage } from "@/components/utils/toast-message";
import { cn } from "@/lib/utils";

type FollowButtonProps = {
  userId: number;
  /** サーバーから受け取ったフォロー済みかどうか */
  following: boolean;
};

function FollowButton({ userId, following }: FollowButtonProps) {
  // サーバーの再検証を待たずに見た目を切り替える（失敗時は元に戻す）
  const [isFollowing, setIsFollowing] = useState(following);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (isPending) return;

    const nextFollowing = !isFollowing;
    setIsFollowing(nextFollowing);

    startTransition(async () => {
      const result = await toggleFollowAction(userId, nextFollowing);

      if ("error" in result) {
        setIsFollowing(!nextFollowing);
        toast.error(result.error);
        return;
      }

      toast.success(<ToastMessage message={result.message} />);
    });
  }

  return (
    <button
      type="button"
      aria-label={isFollowing ? "フォローを解除する" : "フォローする"}
      aria-pressed={isFollowing}
      disabled={isPending}
      onClick={handleClick}
      className={cn(
        "min-w-[104px] rounded-full border px-4 py-1.5 text-[15px] font-bold transition-colors disabled:cursor-not-allowed",
        isFollowing
          ? // フォロー中はホバーで解除できることを赤で示す
            "border-[#536471] bg-transparent text-[#e7e9ea] hover:border-[#f4212e] hover:bg-[#f4212e]/10 hover:text-[#f4212e]"
          : "border-transparent bg-[#eff3f4] text-[#0f1419] hover:bg-[#d7dbdc]",
      )}
    >
      {isFollowing ? "フォロー中" : "フォロー"}
    </button>
  );
}

export { FollowButton };
