import { HomeFeed } from "@/components/home/home-feed";
import { HomeMobileNav } from "@/components/home/home-mobile-nav";
import { HomeRightPanel } from "@/components/home/home-right-panel";
import { HomeSidebar } from "@/components/home/home-sidebar";
import type { TweetTimelineData } from "@/lib/types/tweet";

type HomeTimelineProps = {
  timeline: TweetTimelineData;
  timelineError?: string | null;
};

function HomeTimeline({ timeline, timelineError }: HomeTimelineProps) {
  return (
    <div className="home-page font-chirp min-h-dvh w-full bg-black text-[#e7e9ea]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1280px] justify-center">
        <div className="hidden shrink-0 lg:block lg:w-[275px]" aria-hidden />

        <aside className="fixed top-0 left-1/2 z-20 hidden h-dvh w-full max-w-[1280px] -translate-x-1/2 lg:block">
          <div className="h-full w-[275px]">
            <HomeSidebar />
          </div>
        </aside>

        <div className="min-w-0 w-full max-w-[600px] flex-1 lg:shrink-0">
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
