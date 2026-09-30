/** フォロー中一覧などで1行に表示するユーザーの要約 */
export type UserSummary = {
  id: number;
  /** 表示名（プロフィール名 or メールのローカル部にフォールバック） */
  name: string;
  /** @から始まるハンドル表示に使う文字列 */
  handle: string;
  bio: string;
  avatarUrl?: string;
  /** ログイン中のユーザーがこのユーザーをフォロー済みかどうか */
  isFollowing: boolean;
};

/** フォロー中ユーザー一覧のページデータ */
export type FollowingListData = {
  users: UserSummary[];
  hasMore: boolean;
  nextCursor: number | null;
};
