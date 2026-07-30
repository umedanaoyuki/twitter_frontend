export type Tweet = {
  id: string;
  /** 投稿者のユーザーID。ログイン中のユーザーと比較して削除可否を判定する */
  authorId: number | null;
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
  stats: {
    replies: string;
    reposts: string;
    likes: string;
    views: string;
  };
};

export type TweetTimelineData = {
  tweets: Tweet[];
  hasMore: boolean;
  nextCursor: number | null;
  /** ログイン中のユーザーID。未ログインなら null */
  currentUserId: number | null;
};
