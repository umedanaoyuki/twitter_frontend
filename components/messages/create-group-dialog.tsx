"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createGroupAction } from "@/app/messages/action";
import { MemberCandidateList } from "@/components/messages/member-candidate-list";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToastMessage } from "@/components/utils/toast-message";
import type { MemberCandidate } from "@/lib/types/message";
import { cn } from "@/lib/utils";
import {
  getGroupNameLength,
  MAX_GROUP_NAME_LENGTH,
  validateGroupName,
  validateMemberUserIds,
} from "@/lib/validation/group";

type CreateGroupDialogProps = {
  /** フォロー中ユーザーから作ったメンバー候補 */
  candidates: MemberCandidate[];
};

function CreateGroupDialog({ candidates }: CreateGroupDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isPending, startTransition] = useTransition();

  const nameLength = getGroupNameLength(name);
  const nameError = name ? validateGroupName(name) : null;
  const membersError = validateMemberUserIds([...selectedIds]);
  const canSubmit =
    !isPending && name.trim().length > 0 && !nameError && !membersError;

  function handleOpenChange(next: boolean) {
    // 開くたびに初期状態へ戻す（キャンセルした場合の入力も破棄）
    if (next) {
      setName("");
      setSelectedIds(new Set());
    }
    setOpen(next);
  }

  function toggleSelected(userId: number) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    startTransition(async () => {
      try {
        const result = await createGroupAction(name, [...selectedIds]);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        toast.success(<ToastMessage message={result.message} />);
        setOpen(false);
        router.push(`/messages/${result.groupId}`);
      } catch (error) {
        console.error("グループの作成でエラーが発生しました", error);
        toast.error("グループの作成に失敗しました");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="shrink-0 rounded-full bg-[#eff3f4] px-4 py-1.5 text-[15px] font-bold text-[#0f1419] transition-colors hover:bg-[#d7dbdc]"
        >
          新しいグループ
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        // 説明文は置かないため、Radix の aria-describedby 警告を抑止する
        aria-describedby={undefined}
        className="gap-0 rounded-2xl border border-[#2f3336] bg-black p-0 text-[#e7e9ea] sm:max-w-[600px]"
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader className="sticky top-0 z-10 flex flex-row items-center gap-6 bg-black/90 px-4 py-3 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="flex size-9 items-center justify-center rounded-full text-[#e7e9ea] transition-colors hover:bg-[#181818] disabled:opacity-50"
              aria-label="閉じる"
            >
              ✕
            </button>
            <DialogTitle className="flex-1 text-left text-xl font-bold text-[#e7e9ea]">
              新しいグループ
            </DialogTitle>
            <button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                "rounded-full bg-[#eff3f4] px-4 py-1.5 text-[15px] font-bold text-[#0f1419] transition-opacity hover:bg-[#d7dbdc]",
                !canSubmit && "opacity-50",
              )}
            >
              {isPending ? "作成中..." : "作成"}
            </button>
          </DialogHeader>

          <div className="flex flex-col gap-4 px-4 pt-2 pb-6">
            <div className="flex flex-col gap-1">
              <div
                className={cn(
                  "rounded-md border bg-black px-3 py-2 transition-colors focus-within:border-[#1d9bf0]",
                  nameError ? "border-[#f4212e]" : "border-[#333639]",
                )}
              >
                <div className="flex items-baseline justify-between">
                  <label
                    htmlFor="group-name"
                    className="text-[13px] text-[#71767b]"
                  >
                    グループ名
                  </label>
                  <span className="text-[13px] text-[#71767b] tabular-nums">
                    {nameLength} / {MAX_GROUP_NAME_LENGTH}
                  </span>
                </div>
                <input
                  id="group-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPending}
                  placeholder="グループ名"
                  className="mt-1 w-full bg-transparent text-[15px] text-[#e7e9ea] placeholder:text-[#71767b] focus:outline-none disabled:opacity-50"
                />
              </div>
              {nameError ? (
                <p className="px-1 text-[13px] text-[#f4212e]">{nameError}</p>
              ) : null}
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="flex w-full items-baseline justify-between text-[13px] text-[#71767b]">
                <span>メンバー（フォロー中のユーザー）</span>
                <span className="tabular-nums">{selectedIds.size}人選択中</span>
              </legend>
              <MemberCandidateList
                candidates={candidates}
                selectedIds={selectedIds}
                onToggle={toggleSelected}
                disabled={isPending}
              />
              <p className="px-1 text-[13px] text-[#71767b]">
                自分自身は作成時に自動でメンバーに追加されます
              </p>
            </fieldset>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { CreateGroupDialog };
