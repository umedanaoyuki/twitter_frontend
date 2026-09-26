import { NotificationList } from "@/components/notifications/notification-list";
import type { NotificationListData } from "@/lib/types/notification";

type NotificationFeedProps = {
  list: NotificationListData | null;
  error?: string | null;
};

function NotificationFeed({ list, error }: NotificationFeedProps) {
  return (
    <main className="font-chirp min-h-dvh w-full min-w-0 overflow-x-hidden border-[#2f3336] pb-[calc(3.5rem+env(safe-area-inset-bottom,0))] lg:border-x lg:pb-0">
      <header className="sticky top-0 z-10 border-b border-[#2f3336] bg-black/80 px-4 py-3 backdrop-blur-md">
        <h1 className="text-xl font-bold text-[#e7e9ea]">通知</h1>
      </header>

      <section aria-label="通知一覧">
        {error || !list ? (
          <p className="px-4 py-8 text-center text-[15px] text-[#f4212e]">
            {error ?? "通知を取得できませんでした"}
          </p>
        ) : (
          <NotificationList
            key={list.notifications[0]?.id ?? "empty"}
            {...list}
          />
        )}
      </section>
    </main>
  );
}

export { NotificationFeed };
