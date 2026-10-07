"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { clearNotificationsAction } from "@/app/notifications/action";
import { Button } from "@/components/ui/button";
import { ToastMessage } from "@/components/utils/toast-message";

type ClearNotificationsButtonProps = {
  /** 消せる通知があるか。無ければボタンを無効にする */
  disabled?: boolean;
};

/** 通知をすべて削除するボタン。削除後は一覧とサイドバーのバッジが消える */
function ClearNotificationsButton({ disabled }: ClearNotificationsButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClear() {
    startTransition(async () => {
      const result = await clearNotificationsAction();
      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success(<ToastMessage message="通知を消しました" />);
      // 一覧とサイドバーのバッジを描画し直す
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled || isPending}
      onClick={handleClear}
      className="rounded-full border-[#536471] bg-transparent text-[15px] font-bold text-[#e7e9ea] hover:bg-[#181818] hover:text-[#e7e9ea]"
    >
      {isPending ? "処理中..." : "通知を消す"}
    </Button>
  );
}

export { ClearNotificationsButton };
