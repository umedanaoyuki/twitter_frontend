"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { loadFollowingUsersAction } from "@/app/home/action";
import { UserCard } from "@/components/home/user-card";
import type { FollowingListData, UserSummary } from "@/lib/types/user";

type FollowingListProps = FollowingListData;

/**
 * フォロー中のユーザー一覧。
 * 先頭ページは親から受け取り、末尾までスクロールしたら続きを読み込む。
 */
function FollowingList({
  users: initialUsers,
  hasMore: initialHasMore,
  nextCursor: initialNextCursor,
}: FollowingListProps) {
  const [extraUsers, setExtraUsers] = useState<UserSummary[]>([]);
  const [extraHasMore, setExtraHasMore] = useState<boolean | null>(null);
  const [extraNextCursor, setExtraNextCursor] = useState<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  // 続きを読み込んだときに同じユーザーが重複しないよう取り除く
  const seenIds = new Set<number>();
  const users = [...initialUsers, ...extraUsers].filter((user) => {
    if (seenIds.has(user.id)) return false;
    seenIds.add(user.id);
    return true;
  });

  const hasMore = extraHasMore ?? initialHasMore;
  const nextCursor = extraNextCursor ?? initialNextCursor;

  const handleLoadMore = useCallback(() => {
    if (!nextCursor || isLoadingRef.current) return;

    isLoadingRef.current = true;

    void (async () => {
      try {
        const result = await loadFollowingUsersAction(nextCursor);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        setExtraUsers((current) => [...current, ...result.users]);
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

  if (users.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-[15px] text-[#71767b]">
        まだフォローしているアカウントがありません
      </p>
    );
  }

  return (
    <>
      <ul aria-label="フォロー中のアカウント">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </ul>
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

export { FollowingList };
