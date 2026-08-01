"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { loadLikedTweetsAction } from "@/app/profile/action";
import { TweetTimeline } from "@/components/home/tweet-timeline";
import type { TweetTimelineData } from "@/lib/types/tweet";
import { cn } from "@/lib/utils";

const tabs = ["ポスト", "返信", "メディア", "いいね"] as const;

type Tab = (typeof tabs)[number];

/** 「返信」「メディア」はバックエンドの一覧APIが無いため、まだ切り替えできない */
const selectableTabs: Tab[] = ["ポスト", "いいね"];

type ProfileTabsProps = {
  /** サーバーで取得済みの自分のポスト一覧 */
  timeline: TweetTimelineData;
};

function ProfileTabs({ timeline }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("ポスト");
  // 「いいね」はタブを開いたときに初めて取りに行き、取得後は切り替えても再取得しない
  const [likedTimeline, setLikedTimeline] = useState<TweetTimelineData | null>(
    null,
  );
  const [likedError, setLikedError] = useState<string | null>(null);
  const [isLoadingLikes, startTransition] = useTransition();

  function handleSelect(tab: Tab) {
    if (!selectableTabs.includes(tab)) return;
    setActiveTab(tab);

    if (tab !== "いいね" || likedTimeline || isLoadingLikes) return;

    setLikedError(null);
    startTransition(async () => {
      const result = await loadLikedTweetsAction();

      if ("error" in result) {
        setLikedError(result.error);
        toast.error(result.error);
        return;
      }

      setLikedTimeline({
        tweets: result.tweets,
        hasMore: result.hasMore,
        nextCursor: result.nextCursor,
        // いいね一覧は自分のプロフィールなので、閲覧者は本人のまま
        currentUserId: timeline.currentUserId,
      });
    });
  }

  return (
    <>
      <div
        role="tablist"
        aria-label="プロフィールのタブ"
        className="grid grid-cols-4 border-b border-[#2f3336]"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelect(tab)}
              className={cn(
                "relative py-4 text-[15px] transition-colors hover:bg-[#181818]",
                isActive
                  ? "font-bold text-[#e7e9ea]"
                  : "font-medium text-[#71767b]",
              )}
            >
              {tab}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-[#1d9bf0]" />
              )}
            </button>
          );
        })}
      </div>

      <section role="tabpanel" aria-label={`${activeTab}一覧`}>
        {activeTab === "いいね" ? (
          <LikedTweets
            timeline={likedTimeline}
            isLoading={isLoadingLikes}
            error={likedError}
          />
        ) : (
          <TweetTimeline
            key={timeline.tweets[0]?.id ?? "empty"}
            {...timeline}
          />
        )}
      </section>
    </>
  );
}

function LikedTweets({
  timeline,
  isLoading,
  error,
}: {
  timeline: TweetTimelineData | null;
  isLoading: boolean;
  error: string | null;
}) {
  if (isLoading) {
    return (
      <p
        aria-live="polite"
        className="px-4 py-8 text-center text-[15px] font-bold text-[#1d9bf0]"
      >
        読み込み中...
      </p>
    );
  }

  if (error || !timeline) {
    return (
      <p className="px-4 py-8 text-center text-[15px] text-[#f4212e]">
        {error ?? "いいねしたポストを取得できませんでした"}
      </p>
    );
  }

  return (
    <TweetTimeline
      key={timeline.tweets[0]?.id ?? "empty"}
      {...timeline}
      emptyMessage="まだいいねしたポストがありません"
      loadMore={loadLikedTweetsAction}
    />
  );
}

export { ProfileTabs };
