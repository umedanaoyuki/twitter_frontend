import type { ReactNode } from "react";

import type { Tweet } from "@/lib/mock/home-feed";

type TweetCardProps = {
  tweet: Tweet;
};

function TweetAction({
  label,
  count,
  children,
}: {
  label: string;
  count: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="group flex items-center gap-1 text-[#71767b] transition-colors hover:text-[#1d9bf0]"
    >
      <span className="flex size-[34px] items-center justify-center rounded-full transition-colors group-hover:bg-[#1d9bf0]/10">
        {children}
      </span>
      <span className="min-w-[1ch] text-[13px] tabular-nums">{count}</span>
    </button>
  );
}

function TweetCard({ tweet }: TweetCardProps) {
  const { author, content, timestamp, stats } = tweet;

  return (
    <article className="border-b border-[#2f3336] px-4 py-3 transition-colors hover:bg-[#080808]">
      <div className="flex gap-3">
        <div
          className="size-10 shrink-0 rounded-full bg-[#333639]"
          role="img"
          aria-label={`${author.name}のアバター`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-1 text-[15px]">
              <span className="truncate font-bold text-[#e7e9ea]">
                {author.name}
              </span>
              {author.verified && (
                <svg
                  viewBox="0 0 22 22"
                  aria-label="認証済みアカウント"
                  className="size-[18px] fill-[#1d9bf0]"
                >
                  <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.211-.88-1.652-.443-.441-1.02-.747-1.654-.878-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 4.02 11 4.002c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.213.436-1.656.878-.442.443-.748 1.02-.878 1.654-.13.633-.08 1.29.144 1.896-.587.274-1.018.705-1.372 1.245-.353.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.355.54.855.972 1.44 1.245-.224.606-.274 1.263-.144 1.896.13.634.436 1.211.878 1.652.443.441 1.02.747 1.654.878.633.13 1.29.084 1.897-.136.606.22 1.257.587 1.797.366.54.865.972 1.456 1.246.509-.665 1.265-1.08 2.094-1.145.83.065 1.642.303 2.303.877.662.574 1.13 1.396 1.33 2.28.2.884-.02 1.803-.63 2.548-.61.745-1.538 1.246-2.582 1.392-.646.018-1.273-.213-1.813-.568z" />
                  <path
                    fill="#000"
                    d="M9.414 14.586 6.707 11.879l-1.414 1.414L9.414 17.414 17.12 9.707l-1.414-1.414z"
                  />
                </svg>
              )}
              <span className="truncate text-[#71767b]">@{author.handle}</span>
              <span className="text-[#71767b]">·</span>
              <time className="text-[#71767b]" dateTime={timestamp}>
                {timestamp}
              </time>
            </div>

            <button
              type="button"
              aria-label="ポストのその他の操作"
              className="flex size-[34px] shrink-0 items-center justify-center rounded-full text-[#71767b] transition-colors hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0]"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-current">
                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm9-2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
              </svg>
            </button>
          </div>

          <p className="mt-1 break-words whitespace-pre-wrap text-[15px] leading-snug text-[#e7e9ea]">
            {content}
          </p>

          <div className="mt-3 flex max-w-[425px] justify-between text-[#71767b]">
            <TweetAction label={`返信 ${stats.replies}件`} count={stats.replies}>
              <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] fill-current">
                <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6.5c-3.584 0-6.5 2.916-6.5 6.5s2.916 6.5 6.5 6.5h.177l-.021.01v3.59l5.907-3.27c2.178-1.209 3.544-3.488 3.544-5.93 0-3.582-2.916-6.5-6.5-6.5-3.582 0-6.5 2.918-6.5 6.5z" />
              </svg>
            </TweetAction>
            <TweetAction label={`リポスト ${stats.reposts}件`} count={stats.reposts}>
              <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] fill-current">
                <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zm15 12.12l-4.432-4.14 1.364-1.46L18.5 16.45V8c0-1.1-.896-2-2-2H11V4h5.5c2.209 0 4 1.79 4 4v8.45l3.068-1.93 1.364 1.46-4.432 4.14z" />
              </svg>
            </TweetAction>
            <TweetAction label={`いいね ${stats.likes}件`} count={stats.likes}>
              <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] fill-current">
                <path d="M16.697 3.48c-1.936 0-3.616 1.04-4.865 2.55C10.583 4.52 8.903 3.48 6.967 3.48c-2.776 0-5.027 2.25-5.027 5.027 0 5.75 9.188 11.727 9.188 11.727s9.188-5.977 9.188-11.727c0-2.777-2.251-5.027-5.027-5.027z" />
              </svg>
            </TweetAction>
            <TweetAction label={`表示 ${stats.views}回`} count={stats.views}>
              <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] fill-current">
                <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21v-4h2v4H4zm12.5 0V11h2v10h-2z" />
              </svg>
            </TweetAction>
            <button
              type="button"
              aria-label="共有"
              className="flex size-[34px] items-center justify-center rounded-full text-[#71767b] transition-colors hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0]"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] fill-current">
                <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21.5 3 20.38 3 19V15h2v4c0 .28.22.5.5.5h13c.27 0 .5-.22.5-.5V15h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export { TweetCard };
