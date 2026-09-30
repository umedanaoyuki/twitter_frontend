import { getUserProfile } from "@/lib/api/profile";
import { getUserFollowing } from "@/lib/api/users";
import type { SwaggerUserProfile } from "@/lib/api/types";
import { emailToDisplayName } from "@/lib/tweets/format";
import type { FollowingListData, UserSummary } from "@/lib/types/user";
import { getCurrentUserId } from "@/lib/users/get-current-user";
import { getUsersByIds } from "@/lib/users/get-user-detail";

/**
 * 複数ユーザーのプロフィールをまとめて取得し、user_id をキーにしたMapで返す。
 * 一覧の表示名・アイコンに使うだけなので、未作成・取得失敗のユーザーはMapに含めない。
 */
async function getProfilesByIds(
  userIds: number[],
): Promise<Map<number, SwaggerUserProfile>> {
  const results = await Promise.allSettled(
    userIds.map((userId) => getUserProfile(userId)),
  );

  const profilesById = new Map<number, SwaggerUserProfile>();
  userIds.forEach((userId, index) => {
    const result = results[index];
    if (result?.status === "fulfilled" && result.value) {
      profilesById.set(userId, result.value);
    }
  });

  return profilesById;
}

/**
 * ログイン中のユーザーがフォローしているユーザー一覧を取得する。
 * 未ログインの場合は null を返す。
 *
 * GET /users/{user_id}/following は followed_user_id しか返さないため、
 * 表示名（ユーザー情報）とアイコン・自己紹介（プロフィール）は別途取得して合成する。
 */
export async function getFollowingUsers(options?: {
  cursor?: number;
  limit?: number;
}): Promise<FollowingListData | null> {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  const response = await getUserFollowing(currentUserId, options);

  const followedUserIds = (response.following ?? [])
    .map((follow) => follow.followed_user_id)
    .filter((userId): userId is number => userId != null);

  const [usersById, profilesById] = await Promise.all([
    getUsersByIds(followedUserIds),
    getProfilesByIds(followedUserIds),
  ]);

  const users: UserSummary[] = followedUserIds.map((userId) => {
    const user = usersById.get(userId);
    const profile = profilesById.get(userId);
    // ユーザー情報が取れなかった場合もリンク先は分かるので、IDを使った仮の表示にする
    const handle = user?.email
      ? emailToDisplayName(user.email)
      : `user${userId}`;

    return {
      id: userId,
      name: profile?.name?.trim() || handle,
      handle,
      bio: profile?.bio ?? "",
      avatarUrl: profile?.image_url || undefined,
      // フォロー中一覧に載っている時点でフォロー済み
      isFollowing: true,
    };
  });

  return {
    users,
    hasMore: response.has_more ?? false,
    nextCursor: response.next_cursor ?? null,
  };
}
