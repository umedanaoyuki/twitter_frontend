export type Group = {
  id: string;
  name: string;
  createdAt: string;
};

export type MessageAuthor = {
  id: number;
  name: string;
  handle: string;
  avatarUrl?: string;
};

export type Message = {
  id: string;
  groupId: string;
  author: MessageAuthor;
  content: string;
  /** 「たった今 / ○分」などの相対表記 */
  timestamp: string;
  /** ISO 8601 */
  createdAt: string;
  /** ログイン中ユーザー自身の発言か */
  isMine: boolean;
};

/** グループ作成ダイアログで選択できるユーザー */
export type MemberCandidate = {
  id: number;
  name: string;
  handle: string;
  avatarUrl?: string;
};

export type GroupDetailData = {
  group: Group;
  messages: Message[];
  currentUserId: number;
};
