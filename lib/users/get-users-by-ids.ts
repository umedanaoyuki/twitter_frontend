import { getUserById } from "@/lib/api/users";
import type { SwaggerUserDetail } from "@/lib/api/types";

/**
 * ユーザーIDの配列から重複を除いてユーザー情報をまとめて取得する。
 * コメントAPIは user_id しか返さないため、表示名の解決に使う。
 * 取得に失敗したユーザーは結果に含めず、呼び出し側でフォールバック表示する。
 */
export async function getUsersByIds(
  userIds: number[],
): Promise<Map<number, SwaggerUserDetail>> {
  const uniqueIds = [...new Set(userIds)];

  const results = await Promise.allSettled(
    uniqueIds.map(async (userId) => {
      const { user } = await getUserById(userId);
      return { userId, user };
    }),
  );

  const usersById = new Map<number, SwaggerUserDetail>();
  for (const result of results) {
    if (result.status === "fulfilled" && result.value.user) {
      usersById.set(result.value.userId, result.value.user);
    }
  }

  return usersById;
}
