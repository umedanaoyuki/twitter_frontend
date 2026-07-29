export type Tweet = {
  id: string;
  author: {
    name: string;
    handle: string;
    avatarUrl?: string;
    verified?: boolean;
  };
  content: string;
  imageUrl?: string;
  timestamp: string;
  createdAt: string;
  /** コメント（返信）件数 */
  commentCount: number;
  stats: {
    reposts: string;
    likes: string;
    views: string;
  };
};

export type TweetTimelineData = {
  tweets: Tweet[];
  hasMore: boolean;
  nextCursor: number | null;
  /** ログイン中ユーザーのプロフィール画像URL（投稿フォームのアイコン用） */
  viewerAvatarUrl?: string;
};
