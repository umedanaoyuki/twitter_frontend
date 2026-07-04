"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { loadMoreTweetsAction } from "@/app/home/action";
import { TweetCard } from "@/components/home/tweet-card";
import type { Tweet, TweetTimelineData } from "@/lib/types/tweet";

const LOADING_INDICATOR_DELAY_MS = 1000;

function TweetTimeline({
  tweets: initialTweets,
  hasMore: initialHasMore,
  nextCursor: initialNextCursor,
}: TweetTimelineData) {
  const [extraTweets, setExtraTweets] = useState<Tweet[]>([]);
  const [extraHasMore, setExtraHasMore] = useState<boolean | null>(null);
  const [extraNextCursor, setExtraNextCursor] = useState<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const tweets = [...initialTweets, ...extraTweets];
  const hasMore = extraHasMore ?? initialHasMore;
  const nextCursor = extraNextCursor ?? initialNextCursor;

  const handleLoadMore = useCallback(() => {
    if (!nextCursor || isLoadingRef.current) return;

    isLoadingRef.current = true;

    void (async () => {
      try {
        await new Promise((resolve) =>
          setTimeout(resolve, LOADING_INDICATOR_DELAY_MS),
        );

        const result = await loadMoreTweetsAction(nextCursor);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        setExtraTweets((current) => [...current, ...result.tweets]);
        setExtraHasMore(result.hasMore);
        setExtraNextCursor(result.nextCursor);
      } finally {
        isLoadingRef.current = false;
      }
    })();
  }, [nextCursor]);

  useEffect(() => {
    if (!hasMore || nextCursor == null) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "1px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, nextCursor, handleLoadMore]);

  if (tweets.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-[15px] text-[#71767b]">
        まだポストがありません
      </p>
    );
  }

  return (
    <>
      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
      {hasMore && nextCursor !== null && (
        <div
          ref={loadMoreRef}
          className="border-b border-[#2f3336] px-4 py-4 text-center"
          aria-live="polite"
        >
          <p className="text-[15px] font-bold text-[#1d9bf0]">読み込み中...</p>
        </div>
      )}
    </>
  );
}

export { TweetTimeline };
export type { Tweet };
