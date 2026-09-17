"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { followAction } from "@/app/profile/action";
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
    if (isPending || isFollowing) return;

    setIsFollowing(true);

    startTransition(async () => {
      const result = await followAction(userId);

      if ("error" in result) {
        setIsFollowing(false);
        toast.error(result.error);
        return;
      }

      toast.success(<ToastMessage message={result.message} />);
    });
  }

  return (
    <button
      type="button"
      aria-label={isFollowing ? "フォロー中" : "フォローする"}
      // フォロー済みの場合は押せない（フォロー解除は未対応）
      disabled={isPending || isFollowing}
      onClick={handleClick}
      className={cn(
        "min-w-[104px] rounded-full border px-4 py-1.5 text-[15px] font-bold transition-colors disabled:cursor-not-allowed",
        isFollowing
          ? "border-[#536471] bg-transparent text-[#e7e9ea]"
          : "border-transparent bg-[#eff3f4] text-[#0f1419] hover:bg-[#d7dbdc]",
      )}
    >
      {isFollowing ? "フォロー中" : "フォロー"}
    </button>
  );
}

export { FollowButton };
