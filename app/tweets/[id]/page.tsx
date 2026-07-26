import { TweetDetailView } from "@/components/home/tweet-detail-view";
import { getTweetDetail } from "@/lib/tweets/get-tweet-detail";

type TweetDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TweetDetailPage({
  params,
}: TweetDetailPageProps) {
  const { id } = await params;
  const { tweet, commentList } = await getTweetDetail(id);

  return <TweetDetailView tweet={tweet} commentList={commentList} />;
}
