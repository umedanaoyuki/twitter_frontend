import { HomeFeed } from "@/components/home/home-feed";
import { HomeMobileNav } from "@/components/home/home-mobile-nav";
import { HomeRightPanel } from "@/components/home/home-right-panel";
import { HomeSidebar } from "@/components/home/home-sidebar";

function HomeTimeline() {
  return (
    <div className="home-page font-chirp min-h-dvh w-full overflow-x-hidden bg-black text-[#e7e9ea]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1280px] justify-center">
        {/* デスクトップ: 左サイドバー */}
        <div className="hidden shrink-0 lg:flex lg:w-[275px] lg:justify-end">
          <div className="w-[275px]">
            <HomeSidebar />
          </div>
        </div>

        {/* フィード（SP は全幅 + 下ナビ分の余白） */}
        <div className="min-w-0 w-full max-w-[600px] flex-1 lg:shrink-0">
          <HomeFeed />
        </div>

        {/* デスクトップ: 右カラム */}
        <div className="hidden w-[350px] shrink-0 lg:block">
          <HomeRightPanel />
        </div>
      </div>

      <HomeMobileNav />
    </div>
  );
}

export { HomeTimeline };
