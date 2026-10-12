"use client";

import { useState } from "react";

import { ComposeMessage } from "@/components/messages/compose-message";
import { MessageList } from "@/components/messages/message-list";
import type { Message } from "@/lib/types/message";

type MessageThreadProps = {
  groupId: string;
  initialMessages: Message[];
};

type PostedState = {
  /** 投稿時点でサーバーから受け取っていた最後のメッセージID */
  baseId: string | null;
  messages: Message[];
};

function MessageThread({ groupId, initialMessages }: MessageThreadProps) {
  const lastServerId = initialMessages.at(-1)?.id ?? null;
  const [posted, setPosted] = useState<PostedState>({
    baseId: lastServerId,
    messages: [],
  });

  // 送信APIは id を返さないため、投稿直後のメッセージはサーバーの一覧が更新される
  // （= 末尾のIDが変わる）まで表示し、更新されたら本物に置き換わったとみなして捨てる
  const postedMessages = posted.baseId === lastServerId ? posted.messages : [];

  function handlePosted(message: Message) {
    setPosted((current) => ({
      baseId: lastServerId,
      messages:
        current.baseId === lastServerId
          ? [...current.messages, message]
          : [message],
    }));
  }

  return (
    <>
      <MessageList
        messages={[...initialMessages, ...postedMessages]}
        className="min-h-0 flex-1"
      />
      <ComposeMessage groupId={groupId} onPosted={handlePosted} />
    </>
  );
}

export { MessageThread };
