import { ComposeTweet } from "@/components/home/compose-tweet";
import { TweetTimeline } from "@/components/home/tweet-timeline";
import type { TweetTimelineData } from "@/lib/types/tweet";
import { cn } from "@/lib/utils";

const tabs = ["おすすめ", "フォロー中"] as const;

type HomeFeedProps = {
  timeline: TweetTimelineData;
  timelineError?: string | null;
};

function HomeFeed({ timeline, timelineError }: HomeFeedProps) {
  return (
    <main className="font-chirp min-h-dvh w-full min-w-0 overflow-x-hidden border-[#2f3336] pb-[calc(3.5rem+env(safe-area-inset-bottom,0))] lg:border-x lg:pb-0">
      <header className="sticky top-0 z-10 border-b border-[#2f3336] bg-black/80 backdrop-blur-md">
        <h1 className="px-4 py-3 text-xl font-bold text-[#e7e9ea]">ホーム</h1>
        <nav
          aria-label="タイムラインの種類"
          className="grid grid-cols-2 border-b border-[#2f3336]"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={cn(
                "relative py-4 text-[15px] transition-colors hover:bg-[#181818]",
                index === 0
                  ? "font-bold text-[#e7e9ea]"
                  : "font-medium text-[#71767b]",
              )}
            >
              {tab}
              {index === 0 && (
                <span className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-[#1d9bf0]" />
              )}
            </button>
          ))}
        </nav>
      </header>

      <ComposeTweet avatarUrl={timeline.viewerAvatarUrl} />

      <section aria-label="タイムライン">
        {timelineError ? (
          <p className="px-4 py-8 text-center text-[15px] text-[#f4212e]">
            {timelineError}
          </p>
        ) : (
          <TweetTimeline
            key={timeline.tweets[0]?.id ?? "empty"}
            {...timeline}
          />
        )}
      </section>
    </main>
  );
}

export { HomeFeed };
