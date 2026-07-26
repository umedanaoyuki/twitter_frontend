import { ProfileView } from "@/components/profile/profile-view";
import { getMyProfile } from "@/lib/profile/get-profile";

export default async function ProfilePage() {
  let data = null;
  let error: string | null = null;

  try {
    data = await getMyProfile();
  } catch (e) {
    error = e instanceof Error ? e.message : "プロフィールの取得に失敗しました";
  }

  if (!data) {
    return (
      <ProfileView
        data={null}
        error={
          error ?? "プロフィールを表示するには再度ログインしてください"
        }
      />
    );
  }

  return <ProfileView data={data} error={null} />;
}
