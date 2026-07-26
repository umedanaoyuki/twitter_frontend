import Link from "next/link";

import { HomeMobileNav } from "@/components/home/home-mobile-nav";
import { HomeRightPanel } from "@/components/home/home-right-panel";
import { HomeSidebar } from "@/components/home/home-sidebar";
import { TweetDetailContent } from "@/components/home/tweet-detail-content";
import type { CommentListData } from "@/lib/types/comment";
import type { Tweet } from "@/lib/types/tweet";

type TweetDetailViewProps = {
  tweet: Tweet;
  commentList: CommentListData;
};

function TweetDetailView({ tweet, commentList }: TweetDetailViewProps) {
  return (
    <div className="home-page font-chirp min-h-dvh w-full bg-black text-[#e7e9ea]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1280px] justify-center">
        <div className="hidden shrink-0 lg:block lg:w-[275px]" aria-hidden />

        <aside className="pointer-events-none fixed top-0 left-1/2 z-20 hidden h-dvh w-full max-w-[1280px] -translate-x-1/2 lg:block">
          <div className="pointer-events-auto h-full w-[275px]">
            <HomeSidebar />
          </div>
        </aside>

        <main className="w-full max-w-[600px] min-w-0 flex-1 border-[#2f3336] pb-[calc(3.5rem+env(safe-area-inset-bottom,0))] lg:shrink-0 lg:border-x lg:pb-0">
          <header className="sticky top-0 z-10 flex items-center gap-6 border-b border-[#2f3336] bg-black/80 px-4 py-3 backdrop-blur-md">
            <Link
              href="/home"
              aria-label="ホームへ戻る"
              className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[#181818]"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="size-5 fill-[#e7e9ea]"
              >
                <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-[#e7e9ea]">ポスト</h1>
          </header>

          <TweetDetailContent tweet={tweet} commentList={commentList} />
        </main>

        <div className="hidden w-[350px] shrink-0 lg:block">
          <HomeRightPanel />
        </div>
      </div>

      <HomeMobileNav />
    </div>
  );
}

export { TweetDetailView };
