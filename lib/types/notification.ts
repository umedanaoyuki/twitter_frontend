export type NotificationType = "like" | "follow" | "comment";

/** 通知一覧で1行に表示する通知 */
export type Notification = {
  id: number;
  type: NotificationType;
  /** 通知のきっかけとなった行動をしたユーザー */
  actor: {
    id: number;
    name: string;
    handle: string;
    avatarUrl?: string;
  };
  /** いいね・コメントの対象ツイートID。フォロー通知では null */
  tweetId: number | null;
  /** 対象ツイートの本文。取得できなかった（削除済みなど）場合は null */
  tweetContent: string | null;
  isRead: boolean;
  /** 「○分」などの相対表記 */
  timestamp: string;
  createdAt: string;
};

/** 通知一覧のページデータ */
export type NotificationListData = {
  notifications: Notification[];
  hasMore: boolean;
  nextCursor: number | null;
};
