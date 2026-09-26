import { getNotifications } from "@/lib/api/notifications";
import { getTweet } from "@/lib/api/tweets";
import type { ApiNotification } from "@/lib/api/types";
import { emailToDisplayName, formatRelativeTime } from "@/lib/tweets/format";
import type {
  Notification,
  NotificationListData,
  NotificationType,
} from "@/lib/types/notification";
import { getSessionCookieHeader } from "@/lib/session";
import { getProfilesByIds } from "@/lib/users/get-profiles-by-ids";
import { getUsersByIds } from "@/lib/users/get-user-detail";

const NOTIFICATION_TYPES: NotificationType[] = ["like", "follow", "comment"];

function isNotificationType(value: unknown): value is NotificationType {
  return NOTIFICATION_TYPES.includes(value as NotificationType);
}

/**
 * 複数ツイートの本文をまとめて取得し、tweet_id をキーにしたMapで返す。
 * 削除済み（404）や取得失敗のツイートはMapに含めない。
 */
async function getTweetContentsByIds(
  tweetIds: number[],
): Promise<Map<number, string>> {
  const uniqueIds = [...new Set(tweetIds)];
  const results = await Promise.allSettled(uniqueIds.map(getTweet));

  const contentsById = new Map<number, string>();
  uniqueIds.forEach((tweetId, index) => {
    const result = results[index];
    if (
      result?.status === "fulfilled" &&
      result.value?.tweet?.content != null
    ) {
      contentsById.set(tweetId, result.value.tweet.content);
    }
  });

  return contentsById;
}

/**
 * ログイン中のユーザー宛の通知一覧を取得し、表示用の形へ変換する。
 * 未ログインの場合は null を返す。
 *
 * 通知APIは actor_id / tweet_id しか返さないため、
 * 相手の表示名・アイコンと対象ツイートの本文は別途取得して合成する。
 */
export async function getNotificationList(options?: {
  cursor?: number;
  limit?: number;
}): Promise<NotificationListData | null> {
  const cookieHeader = await getSessionCookieHeader();
  if (!cookieHeader) return null;

  const response = await getNotifications(options);

  // id と actor_id が無い通知は表示のしようがないので除外する
  const apiNotifications = (response.notifications ?? []).filter(
    (
      notification,
    ): notification is ApiNotification & { id: number; actor_id: number } =>
      notification.id != null && notification.actor_id != null,
  );

  const actorIds = apiNotifications.map((n) => n.actor_id);
  const tweetIds = apiNotifications
    .map((n) => n.tweet_id)
    .filter((tweetId): tweetId is number => tweetId != null);

  const [usersById, profilesById, tweetContentsById] = await Promise.all([
    getUsersByIds(actorIds),
    getProfilesByIds(actorIds),
    getTweetContentsByIds(tweetIds),
  ]);

  const notifications: Notification[] = apiNotifications.map((notification) => {
    const actorId = notification.actor_id;
    const user = usersById.get(actorId);
    const profile = profilesById.get(actorId);
    // ユーザー情報が取れなかった場合もリンク先は分かるので、IDを使った仮の表示にする
    const handle = user?.email
      ? emailToDisplayName(user.email)
      : `user${actorId}`;
    const tweetId = notification.tweet_id ?? null;
    const createdAt = notification.created_at ?? "";

    return {
      id: notification.id,
      type: isNotificationType(notification.type) ? notification.type : "like",
      actor: {
        id: actorId,
        name: profile?.name?.trim() || handle,
        handle,
        avatarUrl: profile?.image_url || undefined,
      },
      tweetId,
      tweetContent:
        tweetId != null ? (tweetContentsById.get(tweetId) ?? null) : null,
      isRead: notification.is_read ?? false,
      timestamp: createdAt ? formatRelativeTime(createdAt) : "",
      createdAt,
    };
  });

  return {
    notifications,
    hasMore: response.has_more ?? false,
    nextCursor: response.next_cursor ?? null,
  };
}
