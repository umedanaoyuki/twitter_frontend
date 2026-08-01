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
  /** リツイート数。ボタン操作で増減させるので整形前の数値で保持する */
  retweetCount: number;
  /** ログイン中のユーザーがこのツイートをリツイート済みかどうか */
  isRetweeted: boolean;
  /**
   * リツイートとしてタイムラインに並べている場合の、リツイートした人の表示名。
   * 通常の投稿として並んでいる場合は undefined。
   */
  retweetedBy?: string;
  stats: {
    replies: string;
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
  /** 投稿フォームに表示するログイン中ユーザーのアイコン */
  viewerAvatarUrl?: string;
};
