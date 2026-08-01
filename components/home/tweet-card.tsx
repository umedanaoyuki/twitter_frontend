"use client";

import { useState } from "react";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { CommentDialog } from "@/components/home/comment-dialog";
import type { Comment } from "@/lib/types/comment";
import type { Tweet } from "@/lib/types/tweet";
import { LikeButton } from "@/components/home/like-button";
import { RetweetButton } from "@/components/home/retweet-button";
import { TweetMenu } from "@/components/home/tweet-menu";
import { FaComment } from "react-icons/fa";
import { CiRepeat } from "react-icons/ci";

type TweetCardProps = {
  tweet: Tweet;
  onCommented?: (comment: Comment) => void;
  /** ログイン中のユーザーID。投稿者と一致するときだけ操作メニューを表示する */
  currentUserId?: number | null;
  /** 一覧側で削除されたポストを即座に消すためのコールバック */
  onDeleted?: (tweetId: string) => void;
  /** 詳細画面など、削除後に別ページへ移動したいときの遷移先 */
  redirectAfterDelete?: string;
};

function TweetAction({
  label,
  count,
  onClick,
  children,
}: {
  label: string;
  count?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onClick?.();
      }}
      className="group flex items-center gap-1 text-[#71767b] transition-colors hover:text-[#1d9bf0]"
    >
      <span className="flex size-[34px] items-center justify-center rounded-full transition-colors group-hover:bg-[#1d9bf0]/10">
        {children}
      </span>
      {count ? (
        <span className="min-w-[1ch] text-[13px] tabular-nums">{count}</span>
      ) : null}
    </button>
  );
}

function TweetCard({
  tweet,
  currentUserId,
  onDeleted,
  onCommented,
  redirectAfterDelete,
}: TweetCardProps) {
  const {
    author,
    content,
    imageUrl,
    timestamp,
    createdAt,
    retweetCount,
    isRetweeted,
    retweetedBy,
    likeCount,
    isLiked,
  } = tweet;
  const router = useRouter();
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  // 自分のポストのときだけ削除メニューを出す（他人のポストはバックエンドでも削除不可）
  const isOwnTweet =
    currentUserId != null &&
    tweet.authorId != null &&
    currentUserId === tweet.authorId;

  const navigateToDetail = () => {
    router.push(`/tweets/${tweet.id}`);
  };

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label="ポストの詳細を見る"
      onClick={(event: MouseEvent<HTMLElement>) => {
        // Portal(モーダル)内のイベントはDOM上は外側でもReactツリー上はここへ伝播するため、
        // 実際にカード内から発生したものだけを遷移として扱う
        if (!event.currentTarget.contains(event.target as Node)) return;
        navigateToDetail();
      }}
      onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
        // role="link" のカード自身にフォーカスがある場合のみ遷移する
        if (event.key !== "Enter" || event.target !== event.currentTarget) {
          return;
        }
        navigateToDetail();
      }}
      className="cursor-pointer border-b border-[#2f3336] px-4 py-3 transition-colors hover:bg-[#080808]"
    >
      {retweetedBy && (
        // アバターの幅（size-10 + gap-3）だけ字下げして本文の行頭に揃える
        <p className="mb-1 flex items-center gap-2 pl-[52px] text-[13px] font-bold text-[#71767b]">
          <CiRepeat className="size-4 shrink-0" aria-hidden />
          {retweetedBy}さんがリポストしました
        </p>
      )}

      <div className="flex gap-3">
        {/* 画像の実サイズに引きずられないよう表示サイズを固定する */}
        <div className="size-10 shrink-0 overflow-hidden rounded-full bg-[#333639]">
          {author.avatarUrl ? (
            <Image
              src={author.avatarUrl}
              alt={`${author.name}のアバター`}
              width={40}
              height={40}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            <div
              className="size-full"
              role="img"
              aria-label={`${author.name}のアバター`}
            />
          )}
        </div>

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
              <time className="text-[#71767b]" dateTime={createdAt}>
                {timestamp}
              </time>
            </div>

            {isOwnTweet && (
              <TweetMenu
                tweetId={tweet.id}
                onDeleted={onDeleted}
                redirectTo={redirectAfterDelete}
              />
            )}
          </div>

          {content ? (
            <p className="mt-1 text-[15px] leading-snug wrap-break-word whitespace-pre-wrap text-[#e7e9ea]">
              {content}
            </p>
          ) : null}

          {imageUrl ? (
            <div className="mt-3 overflow-hidden rounded-2xl border border-[#2f3336]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="投稿画像"
                className="max-h-96 w-full object-cover"
              />
            </div>
          ) : null}

          <div className="mt-3 grid max-w-[425px] grid-cols-5">
            <div className="col-span-3 flex justify-between text-[#71767b]">
              <TweetAction
                label="返信"
                onClick={() => setIsCommentDialogOpen(true)}
              >
                <FaComment />
              </TweetAction>
              {/* ボタンは押した直後の状態を自前で持つので、
                  サーバー側の値が変わったらkeyを変えて作り直す */}
              <RetweetButton
                key={`${tweet.id}-${isRetweeted}-${retweetCount}`}
                tweetId={tweet.id}
                count={retweetCount}
                retweeted={isRetweeted}
              />
              <LikeButton
                key={`${tweet.id}-${isLiked}-${likeCount}`}
                tweetId={tweet.id}
                count={likeCount}
                liked={isLiked}
              />
            </div>
          </div>
        </div>
      </div>

      <CommentDialog
        tweet={tweet}
        open={isCommentDialogOpen}
        onOpenChange={setIsCommentDialogOpen}
        onCommented={onCommented}
      />
    </article>
  );
}

export { TweetCard };
