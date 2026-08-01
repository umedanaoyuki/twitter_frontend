"use server";

import { revalidatePath } from "next/cache";

import { createComment } from "@/lib/api/comments";
import { getUserById } from "@/lib/api/users";
import { getTweetComments } from "@/lib/comments/get-comments";
import { mapApiCommentToComment } from "@/lib/comments/map-comment";
import type { Comment } from "@/lib/types/comment";
import { validateCommentContent } from "@/lib/validation/comment";

export type PostCommentState =
  | { error: string }
  | { success: true; message: string; comment: Comment };

export type LoadMoreCommentsState =
  | { error: string }
  | {
      success: true;
      comments: Comment[];
      hasMore: boolean;
      nextCursor: number | null;
    };

function parseTweetId(tweetId: string): number | null {
  const parsed = Number(tweetId);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

export async function postCommentAction(
  tweetId: string,
  content: string,
): Promise<PostCommentState> {
  const parsedTweetId = parseTweetId(tweetId);
  if (parsedTweetId === null) {
    return { error: "コメント対象のポストが見つかりません" };
  }

  const trimmedContent = content.trim();
  const contentError = validateCommentContent(trimmedContent);
  if (contentError) {
    return { error: contentError };
  }

  try {
    const { comment } = await createComment(parsedTweetId, trimmedContent);
    if (!comment) {
      return { error: "コメントの投稿に失敗しました" };
    }

    // コメントAPIは user_id しか返さないため、表示名は別途取得する
    const { user } =
      comment.user_id === undefined
        ? { user: undefined }
        : await getUserById(comment.user_id);

    revalidatePath(`/tweets/${parsedTweetId}`);

    return {
      success: true,
      message: "返信を投稿しました",
      comment: mapApiCommentToComment(comment, user),
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "コメントの投稿に失敗しました",
    };
  }
}

export async function loadMoreCommentsAction(
  tweetId: string,
  cursor: number,
): Promise<LoadMoreCommentsState> {
  const parsedTweetId = parseTweetId(tweetId);
  if (parsedTweetId === null) {
    return { error: "コメント対象のポストが見つかりません" };
  }

  try {
    const commentList = await getTweetComments(parsedTweetId, { cursor });

    return {
      success: true,
      comments: commentList.comments,
      hasMore: commentList.hasMore,
      nextCursor: commentList.nextCursor,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "コメントの取得に失敗しました",
    };
  }
}
