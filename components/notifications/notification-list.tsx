"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { loadMoreNotificationsAction } from "@/app/notifications/action";
import { NotificationCard } from "@/components/notifications/notification-card";
import type {
  Notification,
  NotificationListData,
} from "@/lib/types/notification";

type NotificationListProps = NotificationListData;

/**
 * 通知一覧。
 * 先頭ページは親から受け取り、末尾までスクロールしたら続きを読み込む。
 */
function NotificationList({
  notifications: initialNotifications,
  hasMore: initialHasMore,
  nextCursor: initialNextCursor,
}: NotificationListProps) {
  const [extraNotifications, setExtraNotifications] = useState<Notification[]>(
    [],
  );
  const [extraHasMore, setExtraHasMore] = useState<boolean | null>(null);
  const [extraNextCursor, setExtraNextCursor] = useState<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  // 続きを読み込んだときに同じ通知が重複しないよう取り除く
  const seenIds = new Set<number>();
  const notifications = [...initialNotifications, ...extraNotifications].filter(
    (notification) => {
      if (seenIds.has(notification.id)) return false;
      seenIds.add(notification.id);
      return true;
    },
  );

  const hasMore = extraHasMore ?? initialHasMore;
  const nextCursor = extraNextCursor ?? initialNextCursor;

  const handleLoadMore = useCallback(() => {
    if (!nextCursor || isLoadingRef.current) return;

    isLoadingRef.current = true;

    void (async () => {
      try {
        const result = await loadMoreNotificationsAction(nextCursor);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        setExtraNotifications((current) => [
          ...current,
          ...result.notifications,
        ]);
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

  if (notifications.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-[15px] text-[#71767b]">
        まだ通知はありません
      </p>
    );
  }

  return (
    <>
      <ul aria-label="通知">
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
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

export { NotificationList };
