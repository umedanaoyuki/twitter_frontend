export type Comment = {
  id: string;
  tweetId: string;
  author: {
    name: string;
    handle: string;
  };
  content: string;
  timestamp: string;
  createdAt: string;
};

export type CommentListData = {
  comments: Comment[];
  hasMore: boolean;
  nextCursor: number | null;
};
