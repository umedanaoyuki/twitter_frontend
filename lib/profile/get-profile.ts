import { getUserProfile } from "@/lib/api/profile";
import { getCurrentUserTweets } from "@/lib/api/tweets";
import { getSessionCookieHeader } from "@/lib/session";
import type { ProfilePageData } from "@/lib/types/profile";
import { mapProfileToView } from "@/lib/profile/map-profile";
import { mapApiTweetsToTimelineTweets } from "@/lib/tweets/map-tweet";

/**
 * ログイン中のユーザーのプロフィール画面データを取得する。
 * 未ログインの場合は null を返す。
 *
 * 現在ユーザーのツイート一覧（/user/tweets）からユーザーIDを取得し、
 * そのIDでプロフィール（/users/{user_id}/profile）を取得する。
 */
export async function getMyProfile(options?: {
  cursor?: number;
  limit?: number;
}): Promise<ProfilePageData | null> {
  const cookieHeader = await getSessionCookieHeader();
  if (!cookieHeader) return null;

  const response = await getCurrentUserTweets(options);

  const user = response.user;
  if (!user?.id || !user?.email) {
    throw new Error("ユーザー情報の取得に失敗しました");
  }

  const profile = await getUserProfile(user.id);

  return {
    profile: mapProfileToView(profile, user.email),
    timeline: {
      tweets: mapApiTweetsToTimelineTweets(response.tweets ?? [], user),
      hasMore: response.has_more ?? false,
      nextCursor: response.next_cursor ?? null,
    },
  };
}
