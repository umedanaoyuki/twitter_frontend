import { notFound, redirect } from "next/navigation";

import { ProfileView } from "@/components/profile/profile-view";
import { getUserProfilePage } from "@/lib/profile/get-profile";
import { getCurrentUserId } from "@/lib/users/get-current-user";

type UserProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId <= 0) {
    notFound();
  }

  // 自分のプロフィールは編集できる /profile 側で表示する
  if ((await getCurrentUserId()) === userId) {
    redirect("/profile");
  }

  let data = null;
  let error: string | null = null;

  try {
    data = await getUserProfilePage(userId);
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
