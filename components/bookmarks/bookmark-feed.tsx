import { TweetTimeline } from "@/components/home/tweet-timeline";
import type { TweetTimelineData } from "@/lib/types/tweet";

type BookmarkFeedProps = {
  timeline: TweetTimelineData | null;
  error?: string | null;
};

function BookmarkFeed({ timeline, error }: BookmarkFeedProps) {
  const bookmarkCount = timeline?.tweets.length ?? 0;

  return (
    <main className="font-chirp min-h-dvh w-full min-w-0 overflow-x-hidden border-[#2f3336] pb-[calc(3.5rem+env(safe-area-inset-bottom,0))] lg:border-x lg:pb-0">
      <header className="sticky top-0 z-10 border-b border-[#2f3336] bg-black/80 px-4 py-3 backdrop-blur-md">
        <h1 className="text-xl font-bold text-[#e7e9ea]">ブックマーク</h1>
        {!error && timeline && (
          <p className="text-[13px] text-[#71767b]">
            {bookmarkCount}件のブックマーク
          </p>
        )}
      </header>

      <section aria-label="ブックマーク一覧">
        {error || !timeline ? (
          <p className="px-4 py-8 text-center text-[15px] text-[#f4212e]">
            {error ?? "ブックマークを取得できませんでした"}
          </p>
        ) : (
          <TweetTimeline
            key={timeline.tweets[0]?.id ?? "empty"}
            {...timeline}
            emptyMessage="まだブックマークがありません"
          />
        )}
      </section>
    </main>
  );
}

export { BookmarkFeed };
