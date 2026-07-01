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
};
