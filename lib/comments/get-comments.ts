import { getComments } from "@/lib/api/comments";
import { mapApiCommentsToComments } from "@/lib/comments/map-comment";
import type { CommentListData } from "@/lib/types/comment";
import { getUsersByIds } from "@/lib/users/get-users-by-ids";

/**
 * 指定ツイートのコメントを新しい順に取得し、表示用の形へ変換する。
 * コメントAPIは user_id しか返さないため、投稿者情報は別途まとめて解決する。
 */
export async function getTweetComments(
  tweetId: number,
  options?: { cursor?: number; limit?: number },
): Promise<CommentListData> {
  const response = await getComments(tweetId, options);
  const apiComments = response.comments ?? [];

  const userIds = apiComments
    .map((comment) => comment.user_id)
    .filter((userId): userId is number => userId !== undefined);
  const usersById = await getUsersByIds(userIds);

  return {
    comments: mapApiCommentsToComments(apiComments, usersById),
    hasMore: response.has_more ?? false,
    nextCursor: response.next_cursor ?? null,
  };
}
