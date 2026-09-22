"use client";

import Image from "next/image";

import type { MemberCandidate } from "@/lib/types/message";
import { cn } from "@/lib/utils";

type MemberCandidateListProps = {
  candidates: MemberCandidate[];
  selectedIds: Set<number>;
  onToggle: (userId: number) => void;
  disabled?: boolean;
};

function MemberCandidateList({
  candidates,
  selectedIds,
  onToggle,
  disabled,
}: MemberCandidateListProps) {
  if (candidates.length === 0) {
    return (
      <p className="px-1 py-3 text-[13px] text-[#71767b]">
        候補がありません。下の欄からユーザーIDで追加してください
      </p>
    );
  }

  return (
    <ul className="max-h-60 overflow-y-auto rounded-md border border-[#333639]">
      {candidates.map((candidate) => {
        const checked = selectedIds.has(candidate.id);
        const inputId = `member-candidate-${candidate.id}`;

        return (
          <li
            key={candidate.id}
            className="border-b border-[#2f3336] last:border-b-0"
          >
            <label
              htmlFor={inputId}
              className={cn(
                "flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-[#181818]",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <input
                id={inputId}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(candidate.id)}
                className="size-4 accent-[#1d9bf0]"
              />
              <span className="size-8 shrink-0 overflow-hidden rounded-full bg-[#536471]">
                {candidate.avatarUrl && (
                  <Image
                    src={candidate.avatarUrl}
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="size-full object-cover"
                  />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-bold text-[#e7e9ea]">
                  {candidate.name}
                </span>
                <span className="block truncate text-[13px] text-[#71767b]">
                  @{candidate.handle} · ID: {candidate.id}
                </span>
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

export { MemberCandidateList };
