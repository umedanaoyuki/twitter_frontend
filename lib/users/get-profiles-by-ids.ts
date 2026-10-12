import { getUserProfile } from "@/lib/api/profile";
import type { SwaggerUserProfile } from "@/lib/api/types";

/**
 * 複数ユーザーのプロフィールをまとめて取得し、user_id をキーにしたMapで返す。
 * 一覧の表示名・アイコンに使うだけなので、未作成・取得失敗のユーザーはMapに含めない。
 */
export async function getProfilesByIds(
  userIds: number[],
): Promise<Map<number, SwaggerUserProfile>> {
  const uniqueIds = [...new Set(userIds)];
  const results = await Promise.allSettled(
    uniqueIds.map((userId) => getUserProfile(userId)),
  );

  const profilesById = new Map<number, SwaggerUserProfile>();
  uniqueIds.forEach((userId, index) => {
    const result = results[index];
    if (result?.status === "fulfilled" && result.value) {
      profilesById.set(userId, result.value);
    }
  });

  return profilesById;
}
