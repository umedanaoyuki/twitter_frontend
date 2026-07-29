import { getUserProfile } from "@/lib/api/profile";
import { getCurrentUserTweets } from "@/lib/api/tweets";
import { getSessionCookieHeader } from "@/lib/session";
import type { ProfilePageData } from "@/lib/types/profile";
import { mapProfileToView } from "@/lib/profile/map-profile";
import { getRetweetedTweetIds } from "@/lib/tweets/get-my-retweets";
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

  const [profile, retweetedTweetIds] = await Promise.all([
    getUserProfile(user.id),
    getRetweetedTweetIds(),
  ]);
  const avatarUrl = profile?.image_url || undefined;

  return {
    profile: mapProfileToView(profile, user.email),
    timeline: {
      // 一覧はすべてログイン中ユーザーの投稿なので、投稿者情報は自分の分だけで足りる
      tweets: mapApiTweetsToTimelineTweets(
        response.tweets ?? [],
        new Map([[user.id, user]]),
        {
          avatarUrlsById: avatarUrl
            ? new Map([[user.id, avatarUrl]])
            : undefined,
          retweetedTweetIds,
        },
      ),
      hasMore: response.has_more ?? false,
      nextCursor: response.next_cursor ?? null,
      currentUserId: user.id,
      viewerAvatarUrl: avatarUrl,
    },
  };
}

/**
 * 指定ユーザーのプロフィール画像URLを取得する。
 * アイコンは表示上の付加情報なので、未作成・取得失敗時は undefined を返して
 * 呼び出し元（タイムライン等）の表示を止めない。
 */
export async function getProfileImageUrl(
  userId: number,
): Promise<string | undefined> {
  try {
    const profile = await getUserProfile(userId);
    return profile?.image_url || undefined;
  } catch {
    return undefined;
  }
}
