import { notFound } from "next/navigation";

import { GroupDetailView } from "@/components/messages/group-detail-view";
import { getGroupMessageList } from "@/lib/messages/get-group-messages";
import { findMyGroup } from "@/lib/messages/get-groups";
import { getCurrentUserId } from "@/lib/users/get-current-user";

type GroupDetailPageProps = {
  params: Promise<{ groupId: string }>;
};

function parseGroupId(groupId: string): number | null {
  const parsed = Number(groupId);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

export default async function GroupDetailPage({
  params,
}: GroupDetailPageProps) {
  const { groupId } = await params;
  const parsedGroupId = parseGroupId(groupId);
  if (parsedGroupId === null) {
    notFound();
  }

  // 所属グループの一覧と現在ユーザーは互いに依存しないので並列に取得する
  const [group, currentUserId] = await Promise.all([
    findMyGroup(parsedGroupId),
    getCurrentUserId(),
  ]);

  // 未ログイン、または所属していないグループは存在しないものとして扱う
  if (!group || currentUserId === null) {
    notFound();
  }

  let messages = null;
  let error: string | null = null;

  try {
    messages = await getGroupMessageList(parsedGroupId, currentUserId);
  } catch (e) {
    error = e instanceof Error ? e.message : "メッセージの取得に失敗しました";
  }

  return (
    <GroupDetailView
      group={group}
      messages={messages}
      currentUserId={currentUserId}
      error={error}
    />
  );
}
