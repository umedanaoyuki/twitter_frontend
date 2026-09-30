import Link from "next/link";

import type { Group } from "@/lib/types/message";
import { formatRelativeTime } from "@/lib/tweets/format";

type GroupListItemProps = {
  group: Group;
};

function GroupListItem({ group }: GroupListItemProps) {
  // グループ名の先頭1文字をアイコン代わりにする
  const initial = [...group.name][0] ?? "?";

  return (
    <li className="border-b border-[#2f3336]">
      <Link
        href={`/messages/${group.id}`}
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#080808]"
      >
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1d9bf0]/20 text-[15px] font-bold text-[#1d9bf0]"
        >
          {initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-bold text-[#e7e9ea]">
            {group.name}
          </span>
          <span className="block text-[13px] text-[#71767b]">
            作成: {formatRelativeTime(group.createdAt)}
          </span>
        </span>
      </Link>
    </li>
  );
}

export { GroupListItem };
