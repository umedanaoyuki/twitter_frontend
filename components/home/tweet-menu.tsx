"use client";

import { useState, useTransition } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RiDeleteBin6Line } from "react-icons/ri";

import { deleteTweetAction } from "@/app/home/action";
import { ToastMessage } from "@/components/utils/toast-message";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TweetMenuProps = {
  tweetId: string;
  /** 一覧側で削除したポストを即座に消すためのコールバック */
  onDeleted?: (tweetId: string) => void;
  /** 詳細画面など、削除後に別ページへ移動したいときの遷移先 */
  redirectTo?: string;
};

function TweetMenu({ tweetId, onDeleted, redirectTo }: TweetMenuProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTweetAction(tweetId);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success(<ToastMessage message={result.message} />);
      setConfirmOpen(false);
      onDeleted?.(tweetId);

      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="ポストのその他の操作"
            // カード全体のクリック（詳細への遷移）を発火させない
            onClick={(event: MouseEvent<HTMLButtonElement>) =>
              event.stopPropagation()
            }
            onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) =>
              event.stopPropagation()
            }
            className="flex size-[34px] shrink-0 items-center justify-center rounded-full text-[#71767b] transition-colors hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0]"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-current">
              <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm9-2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
            </svg>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          // Portalで描画されてもReactのツリー上は<article>の子なので、
          // stopPropagationしないとカードのクリック（詳細への遷移）が発火する
          onClick={(event) => event.stopPropagation()}
        >
          <DropdownMenuItem
            variant="destructive"
            // メニューを閉じずに確認ダイアログを開く
            onSelect={(event) => {
              event.preventDefault();
              setConfirmOpen(true);
            }}
          >
            <RiDeleteBin6Line className="size-[18px] shrink-0" aria-hidden />
            削除する
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          showCloseButton={false}
          className="bg-black text-[#e7e9ea]"
          onClick={(event) => event.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              ポストを削除しますか？
            </DialogTitle>
            <DialogDescription className="text-[#71767b]">
              この操作は取り消せません。このポストはタイムラインから削除されます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setConfirmOpen(false)}
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
              {isPending ? "削除中..." : "削除する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { TweetMenu };
