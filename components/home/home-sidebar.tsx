import { HomeSidebarNav } from "@/components/home/home-sidebar-nav";
import { getUnreadNotificationCount } from "@/lib/notifications/get-unread-notification-count";

/**
 * サイドバー。未読通知件数をサーバー側で取得して client component のナビに渡す。
 * getUnreadNotificationCount は cache() 済みなので、モバイルナビと合わせてもAPIアクセスは1回。
 */
async function HomeSidebar() {
  const unreadNotificationCount = await getUnreadNotificationCount();

  return <HomeSidebarNav unreadNotificationCount={unreadNotificationCount} />;
}

export { HomeSidebar };
