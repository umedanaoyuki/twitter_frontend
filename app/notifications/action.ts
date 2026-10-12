"use server";

import { revalidatePath } from "next/cache";

import { deleteAllNotifications } from "@/lib/api/notifications";
import { getNotificationList } from "@/lib/notifications/get-notifications";
import type { Notification } from "@/lib/types/notification";

export type ClearNotificationsState = { error: string } | { success: true };

export type LoadMoreNotificationsState =
  | { error: string }
  | {
      success: true;
      notifications: Notification[];
      hasMore: boolean;
      nextCursor: number | null;
    };

/** 通知一覧の続きを読み込む */
export async function loadMoreNotificationsAction(
  cursor: number,
): Promise<LoadMoreNotificationsState> {
  try {
    const list = await getNotificationList({ cursor });
    if (!list) {
      return { error: "ログインが必要です" };
    }

    return {
      success: true,
      notifications: list.notifications,
      hasMore: list.hasMore,
      nextCursor: list.nextCursor,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "通知の取得に失敗しました",
    };
  }
}

/**
 * 通知をすべて削除する。
 * 「通知を消す」ボタンから呼び、一覧とサイドバーのバッジを消すために使う。
 */
export async function clearNotificationsAction(): Promise<ClearNotificationsState> {
  try {
    await deleteAllNotifications();
    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "通知の削除に失敗しました",
    };
  }
}
