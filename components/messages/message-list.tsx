"use client";

import { useEffect, useRef } from "react";

import { MessageBubble } from "@/components/messages/message-bubble";
import type { Message } from "@/lib/types/message";
import { cn } from "@/lib/utils";

type MessageListProps = {
  messages: Message[];
  className?: string;
};

function MessageList({ messages, className }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages.at(-1)?.id;

  // 初期表示時と新しいメッセージが増えたときは最下部（最新）を見せる
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [lastMessageId]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-y-auto px-4 py-3", className)}
      aria-label="メッセージ一覧"
      role="log"
    >
      {messages.length === 0 ? (
        <p className="py-8 text-center text-[15px] text-[#71767b]">
          まだメッセージがありません
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </ul>
      )}
    </div>
  );
}

export { MessageList };
