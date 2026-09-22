import { GroupListItem } from "@/components/messages/group-list-item";
import type { Group } from "@/lib/types/message";

type GroupListProps = {
  groups: Group[];
};

function GroupList({ groups }: GroupListProps) {
  if (groups.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-[15px] text-[#e7e9ea]">まだグループがありません</p>
        <p className="mt-1 text-[13px] text-[#71767b]">
          右上の「新しいグループ」から作成できます
        </p>
      </div>
    );
  }

  return (
    <ul>
      {groups.map((group) => (
        <GroupListItem key={group.id} group={group} />
      ))}
    </ul>
  );
}

export { GroupList };
