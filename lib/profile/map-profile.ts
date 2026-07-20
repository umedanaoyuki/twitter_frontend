import type { SwaggerUserProfile } from "@/lib/api/types";
import type { ProfileView } from "@/lib/types/profile";
import { emailToDisplayName } from "@/lib/tweets/format";

/** プロフィール作成日を「20XX年X月からXを利用しています」に整形する。 */
function formatJoinedText(isoDate?: string): string {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}年${date.getMonth() + 1}月からXを利用しています`;
}

/**
 * APIのプロフィールを画面表示用のビューモデルに変換する。
 * プロフィール未作成（null）の場合はメールアドレスから初期表示を組み立てる。
 */
export function mapProfileToView(
  profile: SwaggerUserProfile | null,
  email: string,
): ProfileView {
  const handle = emailToDisplayName(email);
  const name = profile?.name?.trim() || handle;
  const bio = profile?.bio ?? "";
  const location = profile?.location ?? "";
  const imageUrl = profile?.image_url || undefined;

  return {
    exists: profile !== null,
    name,
    handle,
    bio,
    location,
    imageUrl,
    joinedText: formatJoinedText(profile?.created_at),
    form: {
      name: profile?.name ?? "",
      bio,
      location,
      imageUrl: profile?.image_url ?? "",
    },
  };
}
