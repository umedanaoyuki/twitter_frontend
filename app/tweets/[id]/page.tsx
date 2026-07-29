import { TweetDetailView } from "@/components/home/tweet-detail-view";
import { getTweetDetail } from "@/lib/tweets/get-tweet-detail";
import { getCurrentUserId } from "@/lib/users/get-current-user";

type TweetDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TweetDetailPage({
  params,
}: TweetDetailPageProps) {
  const { id } = await params;
  // 2つのAPIは互いに依存しないので並列に取得する
  const [tweet, currentUserId] = await Promise.all([
    getTweetDetail(id),
    getCurrentUserId(),
  ]);

  return <TweetDetailView tweet={tweet} currentUserId={currentUserId} />;
}
