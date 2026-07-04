"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RiDeleteBack2Line } from "react-icons/ri";

import { deleteAccountAction } from "@/app/home/action";
import { ToastMessage } from "@/components/utils/toast-message";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeleteAccountButtonProps = {
  label: string;
};

function DeleteAccountButton({ label }: DeleteAccountButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAccountAction();
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
          <RiDeleteBack2Line className="size-[26px] shrink-0 text-[#e7e9ea]" aria-hidden />
          {label}
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="bg-black text-[#e7e9ea]"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            アカウントを削除しますか？
          </DialogTitle>
          <DialogDescription className="text-[#71767b]">
            この操作は取り消せません。アカウントと投稿データが削除されます。
          </DialogDescription>
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
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
            className="rounded-full"
          >
            {isPending ? "処理中..." : "退会する"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteAccountButton };
