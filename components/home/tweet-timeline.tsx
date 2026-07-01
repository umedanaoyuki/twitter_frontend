"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { loadMoreTweetsAction } from "@/app/home/action";
import { TweetCard } from "@/components/home/tweet-card";
import type { Tweet, TweetTimelineData } from "@/lib/types/tweet";

type TweetTimelineProps = TweetTimelineData;

function TweetTimeline({
  tweets: initialTweets,
  hasMore: initialHasMore,
  nextCursor: initialNextCursor,
}: TweetTimelineProps) {
  const [extraTweets, setExtraTweets] = useState<Tweet[]>([]);
  const [extraHasMore, setExtraHasMore] = useState<boolean | null>(null);
  const [extraNextCursor, setExtraNextCursor] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const tweets = [...initialTweets, ...extraTweets];
  const hasMore = extraHasMore ?? initialHasMore;
  const nextCursor = extraNextCursor ?? initialNextCursor;

  function handleLoadMore() {
    if (!nextCursor) return;

    startTransition(async () => {
      const result = await loadMoreTweetsAction(nextCursor);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      setExtraTweets((current) => [...current, ...result.tweets]);
      setExtraHasMore(result.hasMore);
      setExtraNextCursor(result.nextCursor);
    });
  }

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
        <div className="border-b border-[#2f3336] px-4 py-4">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isPending}
            className="w-full rounded-full border border-[#536471] px-4 py-2 text-[15px] font-bold text-[#1d9bf0] transition-colors hover:bg-[#1d9bf0]/10 disabled:opacity-50"
          >
            {isPending ? "読み込み中..." : "もっと見る"}
          </button>
        </div>
      )}
    </>
  );
}

export { TweetTimeline };
export type { Tweet };
