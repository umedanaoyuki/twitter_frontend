import { HomeFeed } from "@/components/home/home-feed";
import { HomeMobileNav } from "@/components/home/home-mobile-nav";
import { HomeRightPanel } from "@/components/home/home-right-panel";
import { HomeSidebar } from "@/components/home/home-sidebar";
import type { TweetTimelineData } from "@/lib/types/tweet";
import type { CurrentUser } from "@/lib/types/user";

type HomeTimelineProps = {
  timeline: TweetTimelineData;
  currentUser: CurrentUser | null;
  timelineError?: string | null;
};

function HomeTimeline({
  timeline,
  currentUser,
  timelineError,
}: HomeTimelineProps) {
  return (
    <div className="home-page font-chirp min-h-dvh w-full bg-black text-[#e7e9ea]">
      <div className="pointer-events-none fixed inset-y-0 left-0 z-20 hidden w-full lg:flex lg:justify-center">
        <div className="flex h-full w-full max-w-[1280px]">
          <div className="pointer-events-auto h-dvh w-[275px]">
            <HomeSidebar currentUser={currentUser} />
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1280px] justify-center">
        <div className="hidden w-[275px] shrink-0 lg:block" aria-hidden />

        <div className="min-w-0 w-full max-w-[600px] flex-1 overflow-x-hidden lg:shrink-0">
          <HomeFeed timeline={timeline} timelineError={timelineError} />
        </div>

        <div className="hidden w-[350px] shrink-0 lg:block">
          <HomeRightPanel />
        </div>
      </div>

      <HomeMobileNav />
    </div>
  );
}

export { HomeTimeline };
