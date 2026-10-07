import { getUserFollowing } from "@/lib/api/users";
import { emailToDisplayName } from "@/lib/tweets/format";
import type { FollowingListData, UserSummary } from "@/lib/types/user";
import { getCurrentUserId } from "@/lib/users/get-current-user";
import { getProfilesByIds } from "@/lib/users/get-profiles-by-ids";
import { getUsersByIds } from "@/lib/users/get-user-detail";

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
