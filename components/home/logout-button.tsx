"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IoLogOutOutline } from "react-icons/io5";

import { logoutAction } from "@/app/home/action";
import { ToastMessage } from "@/components/utils/toast-message";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  label: string;
};

function LogoutButton({ label }: LogoutButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      const result = await logoutAction();
      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success(<ToastMessage message={result.message} />);
      setOpen(false);
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "group flex w-fit items-center gap-5 rounded-full px-4 py-3 text-xl text-[#e7e9ea] transition-colors hover:bg-[#181818]",
          )}
        >
          <IoLogOutOutline
            className="size-[26px] shrink-0 text-[#e7e9ea]"
            aria-hidden
          />
          {label}
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="bg-black text-[#e7e9ea]"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            ログアウトしますか？
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => setOpen(false)}
            className="rounded-full border-[#536471] bg-transparent text-[#e7e9ea] hover:bg-[#181818]"
          >
            キャンセル
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleLogout}
            className="rounded-full bg-[#eff3f4] text-[#0f1419] hover:bg-[#d7dbdc]"
          >
            {isPending ? "処理中..." : "ログアウト"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { LogoutButton };
