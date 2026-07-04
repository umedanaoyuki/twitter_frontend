"use server";

import { revalidatePath } from "next/cache";

import { createImageTweet, createTweet } from "@/lib/api/tweets";
import { deleteAccount } from "@/lib/api/users";
import { getHomeTimeline } from "@/lib/tweets/get-timeline";
import type { Tweet } from "@/lib/types/tweet";
import {
  validateTweetContent,
  validateTweetImage,
} from "@/lib/validation/tweet";
import { clearAuthCookies } from "@/lib/session";

export type PostTweetState =
  | { error: string }
  | { success: true; message: string }
  | null;

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

export async function postTweetAction(
  formData: FormData,
): Promise<PostTweetState> {
  const content = formData.get("content")?.toString() ?? "";
  const imageEntry = formData.get("image");
  const image = imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : null;
  const trimmedContent = content.trim();
  const hasText = trimmedContent.length > 0;
  const hasImage = image !== null;

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
      const imageError = validateTweetImage(image);
      if (imageError) {
        return { error: imageError };
      }

      await createImageTweet(image);
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

