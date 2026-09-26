import { HomeMobileNav } from "@/components/home/home-mobile-nav";
import { HomeRightPanel } from "@/components/home/home-right-panel";
import { HomeSidebar } from "@/components/home/home-sidebar";
import { NotificationFeed } from "@/components/notifications/notification-feed";
import type { NotificationListData } from "@/lib/types/notification";

type NotificationViewProps = {
  list: NotificationListData | null;
  error?: string | null;
};

function NotificationView({ list, error }: NotificationViewProps) {
  return (
    <div className="home-page font-chirp min-h-dvh w-full bg-black text-[#e7e9ea]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1280px] justify-center">
        <div className="hidden shrink-0 lg:block lg:w-[275px]" aria-hidden />

        <aside className="pointer-events-none fixed top-0 left-1/2 z-20 hidden h-dvh w-full max-w-[1280px] -translate-x-1/2 lg:block">
          <div className="pointer-events-auto h-full w-[275px]">
            <HomeSidebar />
          </div>
        </aside>

        <div className="w-full max-w-[600px] min-w-0 flex-1 lg:shrink-0">
          <NotificationFeed list={list} error={error} />
        </div>

        <div className="hidden w-[350px] shrink-0 lg:block">
          <HomeRightPanel />
        </div>
      </div>

      <HomeMobileNav />
    </div>
  );
}

export { NotificationView };
