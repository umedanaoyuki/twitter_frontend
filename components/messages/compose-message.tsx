"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IoSend } from "react-icons/io5";

import { postMessageAction } from "@/app/messages/action";
import type { Message } from "@/lib/types/message";
import { cn } from "@/lib/utils";
import { getMessageLength, MAX_MESSAGE_LENGTH } from "@/lib/validation/message";

type ComposeMessageProps = {
  groupId: string;
  /** 送信に成功したメッセージを親へ渡す（サーバー再取得を待たずに表示するため） */
  onPosted: (message: Message) => void;
};

function ComposeMessage({ groupId, onPosted }: ComposeMessageProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const contentLength = getMessageLength(content);
  const canSubmit =
    !isPending &&
    content.trim().length > 0 &&
    contentLength <= MAX_MESSAGE_LENGTH;

  function submit() {
    if (!canSubmit) return;

    startTransition(async () => {
      try {
        const result = await postMessageAction(groupId, content);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        onPosted(result.message);
        setContent("");
        router.refresh();
      } catch (error) {
        console.error("メッセージの送信でエラーが発生しました", error);
        toast.error("メッセージの送信に失敗しました");
      }
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Ctrl / Cmd + Enter で送信（Enter 単体は改行）
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="メッセージを送信"
      className="shrink-0 border-t border-[#2f3336] bg-black px-4 py-3 pb-[calc(0.75rem+3.5rem+env(safe-area-inset-bottom,0))] lg:pb-3"
    >
      <div className="flex items-end gap-2 rounded-2xl border border-[#333639] bg-black px-3 py-2 transition-colors focus-within:border-[#1d9bf0]">
        <label htmlFor="compose-message" className="sr-only">
          メッセージを入力
        </label>
        <textarea
          id="compose-message"
          name="content"
          rows={1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          placeholder="メッセージを入力"
          className="max-h-40 min-h-[24px] w-full flex-1 resize-none bg-transparent text-[15px] text-[#e7e9ea] placeholder:text-[#71767b] focus:outline-none disabled:opacity-50"
        />
        <span
          className={cn(
            "shrink-0 text-[13px] tabular-nums",
            contentLength > MAX_MESSAGE_LENGTH
              ? "text-[#f4212e]"
              : "text-[#71767b]",
          )}
        >
          {MAX_MESSAGE_LENGTH - contentLength}
        </span>
        <button
          type="submit"
          disabled={!canSubmit}
          aria-label={isPending ? "送信中" : "送信"}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1d9bf0] text-white transition-opacity hover:bg-[#1a8cd8]",
            !canSubmit && "opacity-50",
          )}
        >
          <IoSend className="size-[18px]" />
        </button>
      </div>
    </form>
  );
}

export { ComposeMessage };
