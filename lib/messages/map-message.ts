import type { ApiMessage, SwaggerUserDetail } from "@/lib/api/types";
import type { Message, MessageAuthor } from "@/lib/types/message";
import { emailToDisplayName, formatRelativeTime } from "@/lib/tweets/format";

export function mapUserToMessageAuthor(
  userId: number,
  user?: SwaggerUserDetail,
  avatarUrl?: string,
): MessageAuthor {
  const email = user?.email ?? `user${userId}`;
  const displayName = emailToDisplayName(email);

  return {
    id: userId,
    name: displayName,
    handle: displayName,
    avatarUrl,
  };
}

export function mapApiMessageToMessage(
  apiMessage: ApiMessage,
  options: {
    currentUserId: number | null;
    usersById: Map<number, SwaggerUserDetail>;
    avatarUrlsById: Map<number, string>;
  },
): Message {
  const userId = apiMessage.user_id ?? 0;
  const createdAt = apiMessage.created_at ?? new Date().toISOString();

  return {
    id: String(apiMessage.id ?? ""),
    groupId: String(apiMessage.group_id ?? ""),
    author: mapUserToMessageAuthor(
      userId,
      options.usersById.get(userId),
      options.avatarUrlsById.get(userId),
    ),
    content: apiMessage.content ?? "",
    timestamp: formatRelativeTime(createdAt),
    createdAt,
    isMine: options.currentUserId !== null && userId === options.currentUserId,
  };
}

/** メッセージAPIは新しい順で返すため、チャット表示用に古い順へ並べ替える */
export function sortMessagesByCreatedAtAsc(
  apiMessages: ApiMessage[],
): ApiMessage[] {
  return [...apiMessages].sort((a, b) => {
    const timeDiff =
      new Date(a.created_at ?? 0).getTime() -
      new Date(b.created_at ?? 0).getTime();
    if (timeDiff !== 0) return timeDiff;

    return (a.id ?? 0) - (b.id ?? 0);
  });
}
