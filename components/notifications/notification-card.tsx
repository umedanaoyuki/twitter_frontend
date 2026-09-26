import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import type { Notification, NotificationType } from "@/lib/types/notification";
import { cn } from "@/lib/utils";

type NotificationCardProps = {
  notification: Notification;
};

/** 通知種別ごとのアイコンと本文（「○○さんが〜しました」の「〜しました」部分） */
const NOTIFICATION_STYLES: Record<
  NotificationType,
  { icon: ReactNode; message: string }
> = {
  like: {
    icon: <FaHeart className="size-6 text-[#f91880]" />,
    message: "さんがあなたのポストをいいねしました",
  },
  follow: {
    icon: <CgProfile className="size-7 text-[#1d9bf0]" />,
    message: "さんがあなたをフォローしました",
  },
  comment: {
    icon: <FaRegComment className="size-6 text-[#1d9bf0]" />,
    message: "さんがあなたのポストにコメントしました",
  },
};

/** 通知一覧で使う、通知1件分の行 */
function NotificationCard({ notification }: NotificationCardProps) {
  const { actor, type, tweetId, tweetContent, isRead, timestamp, createdAt } =
    notification;
  const { icon, message } = NOTIFICATION_STYLES[type];
  const profileHref = `/users/${actor.id}`;
  // いいね・コメントはポスト詳細へ、フォローは相手のプロフィールへ遷移する
  const targetHref = tweetId != null ? `/tweets/${tweetId}` : profileHref;

  return (
    <li
      className={cn(
        "relative border-b border-[#2f3336] transition-colors hover:bg-[#080808]",
        !isRead && "bg-[#0a1a2a]/60",
      )}
    >
      {/* 行全体をクリック可能にしつつ、内側のユーザーリンクは個別に押せるようにする */}
      <Link
        href={targetHref}
        className="absolute inset-0"
        aria-label={`${actor.name}${message}`}
      />

      <div className="pointer-events-none flex gap-3 px-4 py-3">
        <span className="flex w-8 shrink-0 justify-end pt-1" aria-hidden>
          {icon}
        </span>

        <div className="min-w-0 flex-1">
          <Link
            href={profileHref}
            aria-label={`${actor.name}のプロフィールを見る`}
            className="pointer-events-auto relative block size-8 overflow-hidden rounded-full bg-[#333639]"
          >
            {actor.avatarUrl ? (
              <Image
                src={actor.avatarUrl}
                alt={`${actor.name}のアバター`}
                width={32}
                height={32}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              <span className="block size-full" aria-hidden />
            )}
          </Link>

          <p className="mt-2 flex min-w-0 flex-wrap items-center gap-x-1 text-[15px] text-[#e7e9ea]">
            <Link
              href={profileHref}
              className="pointer-events-auto relative truncate font-bold hover:underline"
            >
              {actor.name}
            </Link>
            <span>{message}</span>
            {timestamp && (
              <>
                <span className="text-[#71767b]">·</span>
                <time className="text-[#71767b]" dateTime={createdAt}>
                  {timestamp}
                </time>
              </>
            )}
          </p>

          {tweetId != null && (
            <p className="mt-1 line-clamp-3 text-[15px] leading-snug wrap-break-word whitespace-pre-wrap text-[#71767b]">
              {tweetContent ?? "このポストは削除されました"}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

export { NotificationCard };
