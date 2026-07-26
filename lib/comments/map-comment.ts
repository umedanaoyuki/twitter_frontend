import type { ApiComment, SwaggerUserDetail } from "@/lib/api/types";
import type { Comment } from "@/lib/types/comment";
import { emailToDisplayName, formatRelativeTime } from "@/lib/tweets/format";

export function mapApiCommentToComment(
  apiComment: ApiComment,
  user?: SwaggerUserDetail,
): Comment {
  const email = user?.email ?? `user${apiComment.user_id ?? ""}`;
  const displayName = emailToDisplayName(email);
  const createdAt = apiComment.created_at ?? new Date().toISOString();

  return {
    id: String(apiComment.id ?? ""),
    tweetId: String(apiComment.tweet_id ?? ""),
    author: {
      name: displayName,
      handle: displayName,
    },
    content: apiComment.content ?? "",
    timestamp: formatRelativeTime(createdAt),
    createdAt,
  };
}

export function mapApiCommentsToComments(
  apiComments: ApiComment[],
  usersById: Map<number, SwaggerUserDetail>,
): Comment[] {
  return apiComments.map((apiComment) =>
    mapApiCommentToComment(
      apiComment,
      apiComment.user_id === undefined
        ? undefined
        : usersById.get(apiComment.user_id),
    ),
  );
}
