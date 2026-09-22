"use server";

import { revalidatePath } from "next/cache";

import { createGroup, createGroupMessage } from "@/lib/api/groups";
import { mapUserToMessageAuthor } from "@/lib/messages/map-message";
import { getProfileImageUrl } from "@/lib/profile/get-profile";
import { formatRelativeTime } from "@/lib/tweets/format";
import type { MemberCandidate, Message } from "@/lib/types/message";
import { getCurrentUser } from "@/lib/users/get-current-user";
import { getUserDetail } from "@/lib/users/get-user-detail";
import {
  parseUserIdInput,
  validateGroupName,
  validateMemberUserIds,
} from "@/lib/validation/group";
import { validateMessageContent } from "@/lib/validation/message";

export type PostMessageState =
  | { error: string }
  | { success: true; message: Message };

export type CreateGroupState =
  | { error: string }
  | { success: true; message: string; groupId: string };

export type AddMemberCandidateState =
  | { error: string }
  | { success: true; candidate: MemberCandidate };

function parseGroupId(groupId: string): number | null {
  const parsed = Number(groupId);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

export async function postMessageAction(
  groupId: string,
  content: string,
): Promise<PostMessageState> {
  const parsedGroupId = parseGroupId(groupId);
  if (parsedGroupId === null) {
    return { error: "送信先のグループが見つかりません" };
  }

  const trimmedContent = content.trim();
  const contentError = validateMessageContent(trimmedContent);
  if (contentError) {
    return { error: contentError };
  }

  try {
    const [{ message }, currentUser] = await Promise.all([
      createGroupMessage(parsedGroupId, trimmedContent),
      getCurrentUser(),
    ]);
    if (!message || currentUser?.id == null) {
      return { error: "メッセージの送信に失敗しました" };
    }

    const avatarUrl = await getProfileImageUrl(currentUser.id);

    revalidatePath(`/messages/${parsedGroupId}`);

    // 送信APIは id と created_at を返さないため、一覧を再取得するまでの仮の値を入れる
    const createdAt = new Date().toISOString();
    return {
      success: true,
      message: {
        id: `posted-${createdAt}`,
        groupId: String(parsedGroupId),
        author: mapUserToMessageAuthor(currentUser.id, currentUser, avatarUrl),
        content: message.content ?? trimmedContent,
        timestamp: formatRelativeTime(createdAt),
        createdAt,
        isMine: true,
      },
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "メッセージの送信に失敗しました",
    };
  }
}

export async function createGroupAction(
  name: string,
  memberUserIds: number[],
): Promise<CreateGroupState> {
  const trimmedName = name.trim();
  const nameError = validateGroupName(trimmedName);
  if (nameError) {
    return { error: nameError };
  }

  const uniqueMemberUserIds = [...new Set(memberUserIds)];
  const membersError = validateMemberUserIds(uniqueMemberUserIds);
  if (membersError) {
    return { error: membersError };
  }

  try {
    const { group } = await createGroup({
      name: trimmedName,
      member_user_ids: uniqueMemberUserIds,
    });
    if (group?.id == null) {
      return { error: "グループの作成に失敗しました" };
    }

    revalidatePath("/messages");

    return {
      success: true,
      message: "グループを作成しました",
      groupId: String(group.id),
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "グループの作成に失敗しました",
    };
  }
}

/**
 * ユーザーIDを指定してメンバー候補に追加する。
 * フォロー機能のUIが未実装のあいだ、フォロー中以外のユーザーを選べるようにするための暫定対応。
 */
export async function addMemberCandidateAction(
  userIdInput: string,
): Promise<AddMemberCandidateState> {
  const userId = parseUserIdInput(userIdInput);
  if (userId === null) {
    return { error: "ユーザーIDは1以上の整数で入力してください" };
  }

  const currentUser = await getCurrentUser();
  if (currentUser?.id === userId) {
    return { error: "自分自身は作成時に自動で追加されます" };
  }

  const user = await getUserDetail(userId);
  if (!user) {
    return { error: "指定されたユーザーが見つかりません" };
  }

  const avatarUrl = await getProfileImageUrl(userId);

  return {
    success: true,
    candidate: mapUserToMessageAuthor(userId, user, avatarUrl),
  };
}
