import Image from "next/image";

import type { Message } from "@/lib/types/message";
import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  message: Message;
};

function MessageBubble({ message }: MessageBubbleProps) {
  const { author, content, timestamp, createdAt, isMine } = message;

  return (
    <li
      className={cn("flex items-end gap-2", isMine && "flex-row-reverse")}
      aria-label={`${author.name}さんのメッセージ`}
    >
      {!isMine && (
        <span className="size-8 shrink-0 overflow-hidden rounded-full bg-[#536471]">
          {author.avatarUrl && (
            <Image
              src={author.avatarUrl}
              alt={`${author.name}のアバター`}
              width={32}
              height={32}
              unoptimized
              className="size-full object-cover"
            />
          )}
        </span>
      )}

      <div
        className={cn(
          "flex max-w-[75%] flex-col gap-1",
          isMine ? "items-end" : "items-start",
        )}
      >
        {!isMine && (
          <span className="px-1 text-[13px] text-[#71767b]">{author.name}</span>
        )}
        <p
          className={cn(
            "rounded-2xl px-4 py-2 text-[15px] leading-snug wrap-break-word whitespace-pre-wrap",
            isMine
              ? "rounded-br-sm bg-[#1d9bf0] text-white"
              : "rounded-bl-sm bg-[#2f3336] text-[#e7e9ea]",
          )}
        >
          {content}
        </p>
        <time className="px-1 text-[13px] text-[#71767b]" dateTime={createdAt}>
          {timestamp}
        </time>
      </div>
    </li>
  );
}

export { MessageBubble };
