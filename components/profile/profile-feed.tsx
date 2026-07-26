import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

import { ProfileHeader } from "@/components/profile/profile-header";
import { TweetTimeline } from "@/components/home/tweet-timeline";
import type { ProfilePageData } from "@/lib/types/profile";
import { cn } from "@/lib/utils";

const tabs = ["ポスト", "返信", "メディア", "いいね"] as const;

type ProfileFeedProps = {
  data: ProfilePageData | null;
  error?: string | null;
};

function ProfileFeed({ data, error }: ProfileFeedProps) {
  const displayName = data?.profile.name ?? "プロフィール";
  const tweetCount = data?.timeline.tweets.length ?? 0;

  return (
    <main className="font-chirp min-h-dvh w-full min-w-0 overflow-x-hidden border-[#2f3336] pb-[calc(3.5rem+env(safe-area-inset-bottom,0))] lg:border-x lg:pb-0">
      <header className="sticky top-0 z-10 flex items-center gap-6 border-b border-[#2f3336] bg-black/80 px-4 py-2 backdrop-blur-md">
        <Link
          href="/home"
          aria-label="戻る"
          className="flex size-9 items-center justify-center rounded-full text-[#e7e9ea] transition-colors hover:bg-[#181818]"
        >
          <IoArrowBack className="size-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-[#e7e9ea]">
            {displayName}
          </h1>
          <p className="text-[13px] text-[#71767b]">{tweetCount}件のポスト</p>
        </div>
      </header>

      {error || !data ? (
        <p className="px-4 py-8 text-center text-[15px] text-[#f4212e]">
          {error ?? "プロフィールを取得できませんでした"}
        </p>
      ) : (
        <>
          <ProfileHeader profile={data.profile} />

          <nav
            aria-label="プロフィールのタブ"
            className="grid grid-cols-4 border-b border-[#2f3336]"
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

          <section aria-label="自分のポスト一覧">
            <TweetTimeline
              key={data.timeline.tweets[0]?.id ?? "empty"}
              {...data.timeline}
            />
          </section>
        </>
      )}
    </main>
  );
}

export { ProfileFeed };
