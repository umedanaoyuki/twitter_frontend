export type Tweet = {
  id: string;
  author: {
    name: string;
    handle: string;
    avatarUrl?: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  stats: {
    replies: string;
    reposts: string;
    likes: string;
    views: string;
  };
};

export const mockTweets: Tweet[] = [
  {
    id: "1",
    author: {
      name: "Next.js",
      handle: "nextjs",
      verified: true,
    },
    content:
      "App Router でホームタイムラインの UI を組み立てるのは、3カラムレイアウトから始めるのがおすすめです。",
    timestamp: "2時間",
    stats: {
      replies: "24",
      reposts: "128",
      likes: "1,204",
      views: "5.2万",
    },
  },
  {
    id: "2",
    author: {
      name: "テストユーザー",
      handle: "testuser",
    },
    content:
      "Twitter クローンのホーム画面、マークアップだけ先に作ってから API 連携する進め方にしました。",
    timestamp: "5時間",
    stats: {
      replies: "3",
      reposts: "12",
      likes: "89",
      views: "1,402",
    },
  },
  {
    id: "3",
    author: {
      name: "デザインの話",
      handle: "design_daily",
    },
    content:
      "ダークテーマでは境界線よりも背景のコントラスト差でセクションを分けると、X に近い見た目になります。",
    timestamp: "1日前",
    stats: {
      replies: "41",
      reposts: "256",
      likes: "3,891",
      views: "12万",
    },
  },
];

export const mockTrends = [
  {
    category: "日本のトレンド",
    title: "Next.js 16",
    posts: "12,405件のポスト",
  },
  {
    category: "テクノロジー · トレンド",
    title: "Playwright",
    posts: "8,102件のポスト",
  },
  { category: "トレンド", title: "#TwitterClone", posts: "2,891件のポスト" },
  { category: "スポーツ · トレンド", title: "WBC", posts: "45,200件のポスト" },
];

export const mockSuggestions = [
  { name: "Golang", handle: "golang", avatarColor: "#00add8" },
  { name: "Vercel", handle: "vercel", avatarColor: "#ffffff" },
  { name: "React", handle: "reactjs", avatarColor: "#61dafb" },
];
