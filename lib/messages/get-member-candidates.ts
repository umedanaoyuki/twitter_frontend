import { getFollowing } from "@/lib/api/follows";
import { mapUserToMessageAuthor } from "@/lib/messages/map-message";
import { getAvatarUrlsByIds } from "@/lib/profile/get-profile";
import type { MemberCandidate } from "@/lib/types/message";
import { getUsersByIds } from "@/lib/users/get-user-detail";

/** ダイアログに並べる候補の上限。フォロー中APIの limit 上限に合わせている。 */
const MAX_CANDIDATES = 100;

/**
 * グループ作成時のメンバー候補として、ログイン中ユーザーがフォローしているユーザーを返す。
 * ユーザー検索APIが無いため、フォロー中一覧を候補にしている。
 * 取得に失敗しても作成ダイアログ自体は使えるように、空配列を返す。
 */
export async function getMemberCandidates(
  currentUserId: number,
): Promise<MemberCandidate[]> {
  try {
    const response = await getFollowing(currentUserId, {
      limit: MAX_CANDIDATES,
    });
    const userIds = [
      ...new Set(
        (response.following ?? [])
          .map((follow) => follow.followed_user_id)
          .filter(
            (userId): userId is number =>
              userId != null && userId !== currentUserId,
          ),
      ),
    ];

    const [usersById, avatarUrlsById] = await Promise.all([
      getUsersByIds(userIds),
      getAvatarUrlsByIds(userIds),
    ]);

    return userIds.map((userId) =>
      mapUserToMessageAuthor(
        userId,
        usersById.get(userId),
        avatarUrlsById.get(userId),
      ),
    );
  } catch {
    return [];
  }
}
