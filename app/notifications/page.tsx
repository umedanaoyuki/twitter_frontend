import { NotificationView } from "@/components/notifications/notification-view";
import { getNotificationList } from "@/lib/notifications/get-notifications";

export default async function NotificationsPage() {
  let list = null;
  let error: string | null = null;

  try {
    list = await getNotificationList();
  } catch (e) {
    error = e instanceof Error ? e.message : "通知の取得に失敗しました";
  }

  return (
    <NotificationView
      list={list}
      error={
        list === null && !error
          ? "通知を表示するには再度ログインしてください"
          : error
      }
    />
  );
}
