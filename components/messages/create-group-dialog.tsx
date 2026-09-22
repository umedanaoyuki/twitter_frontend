"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  addMemberCandidateAction,
  createGroupAction,
} from "@/app/messages/action";
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
  parseUserIdInput,
  validateGroupName,
  validateMemberUserIds,
} from "@/lib/validation/group";

type CreateGroupDialogProps = {
  /** フォロー中ユーザーから作ったメンバー候補 */
  initialCandidates: MemberCandidate[];
};

function CreateGroupDialog({ initialCandidates }: CreateGroupDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [candidates, setCandidates] =
    useState<MemberCandidate[]>(initialCandidates);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [userIdInput, setUserIdInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isAddingCandidate, startAddingCandidate] = useTransition();

  const nameLength = getGroupNameLength(name);
  const nameError = name ? validateGroupName(name) : null;
  const membersError = validateMemberUserIds([...selectedIds]);
  const canSubmit =
    !isPending && name.trim().length > 0 && !nameError && !membersError;
  const canAddCandidate =
    !isAddingCandidate && parseUserIdInput(userIdInput) !== null;

  function handleOpenChange(next: boolean) {
    // 開くたびに初期状態へ戻す（キャンセルした場合の入力も破棄）
    if (next) {
      setName("");
      setCandidates(initialCandidates);
      setSelectedIds(new Set());
      setUserIdInput("");
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

  function handleAddCandidate() {
    if (!canAddCandidate) return;

    startAddingCandidate(async () => {
      const result = await addMemberCandidateAction(userIdInput);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      const { candidate } = result;
      setCandidates((current) =>
        current.some((item) => item.id === candidate.id)
          ? current
          : [...current, candidate],
      );
      setSelectedIds((current) => new Set(current).add(candidate.id));
      setUserIdInput("");
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
            </fieldset>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="member-user-id"
                className="text-[13px] text-[#71767b]"
              >
                ユーザーIDで追加
              </label>
              <div className="flex gap-2">
                <input
                  id="member-user-id"
                  type="text"
                  inputMode="numeric"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  onKeyDown={(e) => {
                    // Enter でフォーム全体が送信されないようにする
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCandidate();
                    }
                  }}
                  disabled={isPending || isAddingCandidate}
                  placeholder="例: 2"
                  className="min-w-0 flex-1 rounded-md border border-[#333639] bg-black px-3 py-2 text-[15px] text-[#e7e9ea] placeholder:text-[#71767b] focus:border-[#1d9bf0] focus:outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleAddCandidate}
                  disabled={!canAddCandidate || isPending}
                  className="rounded-full border border-[#536471] px-4 py-1.5 text-[15px] font-bold text-[#e7e9ea] transition-colors hover:bg-[#181818] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAddingCandidate ? "確認中..." : "追加"}
                </button>
              </div>
              <p className="px-1 text-[13px] text-[#71767b]">
                自分は作成時に自動でメンバーに追加されます
              </p>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { CreateGroupDialog };
