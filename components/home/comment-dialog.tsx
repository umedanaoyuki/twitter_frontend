"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { RxCross1 } from "react-icons/rx";

import { postCommentAction } from "@/app/tweets/action";
import { ToastMessage } from "@/components/utils/toast-message";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Comment } from "@/lib/types/comment";
import type { Tweet } from "@/lib/types/tweet";
import { cn } from "@/lib/utils";
import { getCommentLength, MAX_COMMENT_LENGTH } from "@/lib/validation/comment";

type CommentDialogProps = {
  tweet: Tweet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommented?: (comment: Comment) => void;
};

function CommentDialog({
  tweet,
  open,
  onOpenChange,
  onCommented,
}: CommentDialogProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const contentLength = getCommentLength(content);
  const canSubmit =
    !isPending &&
    content.trim().length > 0 &&
    contentLength <= MAX_COMMENT_LENGTH;

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return;

    if (!nextOpen) {
      setContent("");
    }
    onOpenChange(nextOpen);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    startTransition(async () => {
      const result = await postCommentAction(tweet.id, content);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success(<ToastMessage message={result.message} />);
      onCommented?.(result.comment);
      setContent("");
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        onClick={(event) => event.stopPropagation()}
        className="font-chirp top-0 max-h-dvh translate-y-0 gap-0 overflow-y-auto rounded-none border border-[#2f3336] bg-black p-0 text-[#e7e9ea] ring-0 sm:top-[5%] sm:max-w-[600px] sm:rounded-2xl"
      >
        <DialogTitle className="sr-only">返信を投稿</DialogTitle>
        <DialogDescription className="sr-only">
          {tweet.author.name}さんのポストに返信します
        </DialogDescription>

        <div className="flex items-center px-4 py-3">
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            aria-label="閉じる"
            disabled={isPending}
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[#181818] disabled:opacity-50"
          >
            <RxCross1 className="size-[20px]" />
          </button>
        </div>

        <div className="px-4">
          <div className="flex gap-3">
            <div className="flex shrink-0 flex-col items-center">
              <div
                className="size-10 shrink-0 rounded-full bg-[#333639]"
                role="img"
                aria-label={`${tweet.author.name}のアバター`}
              />
              <div className="mt-1 w-0.5 grow bg-[#2f3336]" aria-hidden />
            </div>

            <div className="min-w-0 flex-1 pb-3">
              <div className="flex min-w-0 flex-wrap items-center gap-1 text-[15px]">
                <span className="truncate font-bold">{tweet.author.name}</span>
                <span className="truncate text-[#71767b]">
                  @{tweet.author.handle}
                </span>
                <span className="text-[#71767b]">·</span>
                <time className="text-[#71767b]" dateTime={tweet.createdAt}>
                  {tweet.timestamp}
                </time>
              </div>

              {tweet.content ? (
                <p className="mt-1 text-[15px] leading-snug wrap-break-word whitespace-pre-wrap">
                  {tweet.content}
                </p>
              ) : null}

              {tweet.imageUrl ? (
                <div className="mt-3 overflow-hidden rounded-2xl border border-[#2f3336]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tweet.imageUrl}
                    alt="投稿画像"
                    className="max-h-60 w-full object-cover"
                  />
                </div>
              ) : null}

              <p className="mt-3 text-[15px] text-[#71767b]">
                返信先:{" "}
                <span className="text-[#1d9bf0]">@{tweet.author.handle}</span>
                さん
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-4 pb-4">
          <div className="flex gap-3">
            <div
              className="size-10 shrink-0 rounded-full bg-[#536471]"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <label htmlFor="comment-input" className="sr-only">
                返信をポスト
              </label>
              <textarea
                id="comment-input"
                name="content"
                rows={3}
                autoFocus
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="返信をポスト"
                disabled={isPending}
                className="w-full resize-none bg-transparent text-xl placeholder:text-[#71767b] focus:outline-none disabled:opacity-50"
              />

              <div className="mt-3 flex items-center justify-end gap-3 border-t border-[#2f3336] pt-3">
                {content.trim().length > 0 && (
                  <span
                    className={cn(
                      "text-[13px] tabular-nums",
                      contentLength > MAX_COMMENT_LENGTH
                        ? "text-[#f4212e]"
                        : "text-[#71767b]",
                    )}
                  >
                    {MAX_COMMENT_LENGTH - contentLength}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={cn(
                    "rounded-full bg-[#1d9bf0] px-4 py-1.5 text-[15px] font-bold text-white transition-opacity",
                    !canSubmit && "opacity-50",
                  )}
                >
                  {isPending ? "返信中..." : "返信"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { CommentDialog };
