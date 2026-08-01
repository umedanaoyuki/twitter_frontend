import type { Comment } from "@/lib/types/comment";

type CommentCardProps = {
  comment: Comment;
};

function CommentCard({ comment }: CommentCardProps) {
  const { author, content, timestamp, createdAt } = comment;

  return (
    <article
      aria-label={`${author.name}さんの返信`}
      className="border-b border-[#2f3336] px-4 py-3"
    >
      <div className="flex gap-3">
        <div
          className="size-10 shrink-0 rounded-full bg-[#333639]"
          role="img"
          aria-label={`${author.name}のアバター`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-1 text-[15px]">
            <span className="truncate font-bold text-[#e7e9ea]">
              {author.name}
            </span>
            <span className="truncate text-[#71767b]">@{author.handle}</span>
            <span className="text-[#71767b]">·</span>
            <time className="text-[#71767b]" dateTime={createdAt}>
              {timestamp}
            </time>
          </div>

          <p className="mt-1 text-[15px] leading-snug wrap-break-word whitespace-pre-wrap text-[#e7e9ea]">
            {content}
          </p>
        </div>
      </div>
    </article>
  );
}

export { CommentCard };
