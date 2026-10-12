export const MAX_GROUP_NAME_LENGTH = 50;

export function getGroupNameLength(name: string): number {
  return [...name].length;
}

export function validateGroupName(name: string): string | null {
  const trimmed = name.trim();

  if (!trimmed) {
    return "グループ名を入力してください";
  }

  if (getGroupNameLength(trimmed) > MAX_GROUP_NAME_LENGTH) {
    return `グループ名は${MAX_GROUP_NAME_LENGTH}文字以内で入力してください`;
  }

  return null;
}

/** 作成者はバックエンド側で自動的に追加されるため、それ以外のメンバーを1人以上求める */
export function validateMemberUserIds(memberUserIds: number[]): string | null {
  if (memberUserIds.length === 0) {
    return "メンバーを1人以上選択してください";
  }

  if (memberUserIds.some((userId) => !Number.isInteger(userId) || userId < 1)) {
    return "メンバーの指定が正しくありません";
  }

  return null;
}
