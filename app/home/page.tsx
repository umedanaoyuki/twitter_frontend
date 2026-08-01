import { HomeTimeline } from "@/components/home/home-timeline";
import { getHomeTimeline } from "@/lib/tweets/get-timeline";

export default async function Home() {
  let timeline: Awaited<ReturnType<typeof getHomeTimeline>> | null = null;
  let timelineError: string | null = null;

  try {
    timeline = await getHomeTimeline();
  } catch (error) {
    timelineError =
      error instanceof Error ? error.message : "投稿一覧の取得に失敗しました";
  }

  console.log("timeline", timeline);

  return (
    <HomeTimeline
      timeline={
        timeline ?? {
          tweets: [],
          hasMore: false,
          nextCursor: null,
          currentUserId: null,
        }
      }
      timelineError={
        timeline === null && !timelineError
          ? "投稿一覧を表示するには再度ログインしてください"
          : timelineError
      }
    />
  );
}
