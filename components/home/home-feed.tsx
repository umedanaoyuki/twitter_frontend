"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { loadFollowingUsersAction } from "@/app/home/action";
import { ComposeTweet } from "@/components/home/compose-tweet";
import { FollowingList } from "@/components/home/following-list";
import { TweetTimeline } from "@/components/home/tweet-timeline";
import type { TweetTimelineData } from "@/lib/types/tweet";
import type { FollowingListData } from "@/lib/types/user";
import { cn } from "@/lib/utils";

const tabs = ["おすすめ", "フォロー中"] as const;

type Tab = (typeof tabs)[number];

type HomeFeedProps = {
  timeline: TweetTimelineData;
  timelineError?: string | null;
};

function HomeFeed({ timeline, timelineError }: HomeFeedProps) {
  const [activeTab, setActiveTab] = useState<Tab>("おすすめ");
  // 「フォロー中」はタブを開いたときに初めて取りに行き、取得後は切り替えても再取得しない
  const [followingList, setFollowingList] = useState<FollowingListData | null>(
    null,
  );
  const [followingError, setFollowingError] = useState<string | null>(null);
  const [isLoadingFollowing, startTransition] = useTransition();

  function handleSelect(tab: Tab) {
    setActiveTab(tab);

    if (tab !== "フォロー中" || followingList || isLoadingFollowing) return;

    setFollowingError(null);
    startTransition(async () => {
      const result = await loadFollowingUsersAction();

      if ("error" in result) {
        setFollowingError(result.error);
        toast.error(result.error);
        return;
      }

      setFollowingList({
        users: result.users,
        hasMore: result.hasMore,
        nextCursor: result.nextCursor,
      });
    });
  }

  return (
    <main className="font-chirp min-h-dvh w-full min-w-0 overflow-x-hidden border-[#2f3336] pb-[calc(3.5rem+env(safe-area-inset-bottom,0))] lg:border-x lg:pb-0">
      <header className="sticky top-0 z-10 border-b border-[#2f3336] bg-black/80 backdrop-blur-md">
        <h1 className="px-4 py-3 text-xl font-bold text-[#e7e9ea]">ホーム</h1>
        <nav
          role="tablist"
          aria-label="タイムラインの種類"
          className="grid grid-cols-2 border-b border-[#2f3336]"
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
        </nav>
      </header>

      {activeTab === "フォロー中" ? (
        <section role="tabpanel" aria-label="フォロー中のアカウント">
          <FollowingUsers
            list={followingList}
            isLoading={isLoadingFollowing}
            error={followingError}
          />
        </section>
      ) : (
        <>
          <ComposeTweet avatarUrl={timeline.viewerAvatarUrl} />

          <section role="tabpanel" aria-label="タイムライン">
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
        </>
      )}
    </main>
  );
}

function FollowingUsers({
  list,
  isLoading,
  error,
}: {
  list: FollowingListData | null;
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

  if (error || !list) {
    return (
      <p className="px-4 py-8 text-center text-[15px] text-[#f4212e]">
        {error ?? "フォロー中のアカウントを取得できませんでした"}
      </p>
    );
  }

  return <FollowingList key={list.users[0]?.id ?? "empty"} {...list} />;
}

export { HomeFeed };
