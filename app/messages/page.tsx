import { GroupListView } from "@/components/messages/group-list-view";
import { getMemberCandidates } from "@/lib/messages/get-member-candidates";
import { getMyGroups } from "@/lib/messages/get-groups";
import type { MemberCandidate } from "@/lib/types/message";
import { getCurrentUserId } from "@/lib/users/get-current-user";

export default async function MessagesPage() {
  let groups = null;
  let error: string | null = null;
  let memberCandidates: MemberCandidate[] = [];

  try {
    const [fetchedGroups, currentUserId] = await Promise.all([
      getMyGroups(),
      getCurrentUserId(),
    ]);
    groups = fetchedGroups;
    if (currentUserId !== null) {
      memberCandidates = await getMemberCandidates(currentUserId);
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "グループの取得に失敗しました";
  }

  return (
    <GroupListView
      groups={groups}
      memberCandidates={memberCandidates}
      error={
        groups === null && !error
          ? "メッセージを表示するには再度ログインしてください"
          : error
      }
    />
  );
}
