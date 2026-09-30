import { getGroupMessages } from "@/lib/api/groups";
import {
  mapApiMessageToMessage,
  sortMessagesByCreatedAtAsc,
} from "@/lib/messages/map-message";
import { getAvatarUrlsByIds } from "@/lib/profile/get-profile";
import type { Message } from "@/lib/types/message";
import { getUsersByIds } from "@/lib/users/get-user-detail";

/**
 * グループ内のメッセージを古い順に取得し、表示用の形へ変換する。
 * メッセージAPIは user_id しか返さないため、投稿者の表示名とアイコンは別途まとめて解決する。
 */
export async function getGroupMessageList(
  groupId: number,
  currentUserId: number | null,
): Promise<Message[]> {
  const response = await getGroupMessages(groupId);
  const apiMessages = sortMessagesByCreatedAtAsc(response.messages ?? []);

  const userIds = apiMessages
    .map((message) => message.user_id)
    .filter((userId): userId is number => userId != null);

  const [usersById, avatarUrlsById] = await Promise.all([
    getUsersByIds(userIds),
    getAvatarUrlsByIds(userIds),
  ]);

  return apiMessages.map((apiMessage) =>
    mapApiMessageToMessage(apiMessage, {
      currentUserId,
      usersById,
      avatarUrlsById,
    }),
  );
}
