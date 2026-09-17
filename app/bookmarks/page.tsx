import { BookmarkView } from "@/components/bookmarks/bookmark-view";
import { getBookmarkTimeline } from "@/lib/bookmarks/get-bookmark-timeline";

export default async function BookmarksPage() {
  let timeline = null;
  let error: string | null = null;

  try {
    timeline = await getBookmarkTimeline();
  } catch (e) {
    error =
      e instanceof Error ? e.message : "ブックマークの取得に失敗しました";
  }

  return (
    <BookmarkView
      timeline={timeline}
      error={
        timeline === null && !error
          ? "ブックマークを表示するには再度ログインしてください"
          : error
      }
    />
  );
}
