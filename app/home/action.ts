"use server";

import { revalidatePath } from "next/cache";
import { getHomeTimeline } from "@/lib/tweets/get-timeline";
import { deleteAccount } from "@/lib/api/users";
import type { Tweet } from "@/lib/types/tweet";
import { validateTweetContent } from "@/lib/validation/tweet";
import { clearAuthCookies } from "@/lib/session";
import {
  completeTweetImage,
  createTweet,
  presignTweetImage,
} from "@/lib/api/tweets";

export type PostTweetState =
  | { error: string }
  | { success: true; message: string }
  | null;

export type PresignTweetImageState =
  | { error: string }
  | { success: true; key: string; uploadUrl: string; publicUrl: string };

export type LoadMoreTweetsState =
  | { error: string }
  | {
      success: true;
      tweets: Tweet[];
      hasMore: boolean;
      nextCursor: number | null;
    };

export type DeleteAccountState =
  | { error: string }
  | { success: true; message: string };

export async function presignTweetImageAction(
  contentType: string,
  size: number,
): Promise<PresignTweetImageState> {
  try {
    const result = await presignTweetImage({ content_type: contentType, size });
    if (!result.key || !result.upload_url) {
      return { error: "画像のアップロード準備に失敗しました" };
    }

    return {
      success: true,
      key: result.key,
      uploadUrl: result.upload_url,
      publicUrl: result.public_url ?? "",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "画像のアップロード準備に失敗しました",
    };
  }
}

export async function postTweetAction(
  formData: FormData,
): Promise<PostTweetState> {
  const content = formData.get("content")?.toString() ?? "";
  const imageKey = formData.get("imageKey")?.toString() || null;
  const trimmedContent = content.trim();
  const hasText = trimmedContent.length > 0;
  const hasImage = imageKey !== null;

  if (!hasText && !hasImage) {
    return { error: "テキストまたは画像を入力してください" };
  }

  if (hasText && hasImage) {
    return {
      error:
        "現在はテキストと画像を同時に1件のツイートに投稿できません。どちらか一方を選択してください",
    };
  }

  try {
    if (hasImage) {
      await completeTweetImage(imageKey);
      revalidatePath("/home");
      return { success: true, message: "画像を投稿しました" };
    }

    const contentError = validateTweetContent(trimmedContent);
    if (contentError) {
      return { error: contentError };
    }

    await createTweet({ content: trimmedContent });
    revalidatePath("/home");
    return { success: true, message: "ポストしました" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "投稿に失敗しました",
    };
  }
}

export async function loadMoreTweetsAction(
  cursor: number,
): Promise<LoadMoreTweetsState> {
  try {
    const timeline = await getHomeTimeline({ cursor });
    if (!timeline) {
      return { error: "ログインが必要です" };
    }

    return {
      success: true,
      tweets: timeline.tweets,
      hasMore: timeline.hasMore,
      nextCursor: timeline.nextCursor,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "投稿の取得に失敗しました",
    };
  }
}

export async function deleteAccountAction(): Promise<DeleteAccountState> {
  try {
    await deleteAccount();
    await clearAuthCookies();
    return { success: true, message: "退会が完了しました" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "退会に失敗しました",
    };
  }
}
