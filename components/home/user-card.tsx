import Image from "next/image";
import Link from "next/link";

import { FollowButton } from "@/components/profile/follow-button";
import type { UserSummary } from "@/lib/types/user";

type UserCardProps = {
  user: UserSummary;
};

/** フォロー中一覧などで使う、ユーザー1人分の行 */
function UserCard({ user }: UserCardProps) {
  const profileHref = `/users/${user.id}`;

  return (
    <li className="border-b border-[#2f3336] px-4 py-3 transition-colors hover:bg-[#080808]">
      <div className="flex gap-3">
        {/* 画像の実サイズに引きずられないよう表示サイズを固定する */}
        <Link
          href={profileHref}
          aria-label={`${user.name}のプロフィールを見る`}
          className="size-10 shrink-0 overflow-hidden rounded-full bg-[#333639]"
        >
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={`${user.name}のアバター`}
              width={40}
              height={40}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            <span className="block size-full" aria-hidden />
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 text-[15px]">
              <Link
                href={profileHref}
                className="block truncate font-bold text-[#e7e9ea] hover:underline"
              >
                {user.name}
              </Link>
              <p className="truncate text-[#71767b]">@{user.handle}</p>
            </div>

            <FollowButton
              key={`follow-${user.id}-${user.isFollowing}`}
              userId={user.id}
              following={user.isFollowing}
            />
          </div>

          {user.bio ? (
            <p className="mt-1 text-[15px] leading-snug wrap-break-word whitespace-pre-wrap text-[#e7e9ea]">
              {user.bio}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export { UserCard };
