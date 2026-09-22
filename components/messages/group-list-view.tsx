import { HomeMobileNav } from "@/components/home/home-mobile-nav";
import { HomeRightPanel } from "@/components/home/home-right-panel";
import { HomeSidebar } from "@/components/home/home-sidebar";
import { CreateGroupDialog } from "@/components/messages/create-group-dialog";
import { GroupList } from "@/components/messages/group-list";
import type { Group, MemberCandidate } from "@/lib/types/message";

type GroupListViewProps = {
  groups: Group[] | null;
  memberCandidates: MemberCandidate[];
  error?: string | null;
};

function GroupListView({
  groups,
  memberCandidates,
  error,
}: GroupListViewProps) {
  const canCreate = !error && groups !== null;

  return (
    <div className="home-page font-chirp min-h-dvh w-full bg-black text-[#e7e9ea]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1280px] justify-center">
        <div className="hidden shrink-0 lg:block lg:w-[275px]" aria-hidden />

        <aside className="pointer-events-none fixed top-0 left-1/2 z-20 hidden h-dvh w-full max-w-[1280px] -translate-x-1/2 lg:block">
          <div className="pointer-events-auto h-full w-[275px]">
            <HomeSidebar />
          </div>
        </aside>

        <main className="font-chirp min-h-dvh w-full max-w-[600px] min-w-0 flex-1 overflow-x-hidden border-[#2f3336] pb-[calc(3.5rem+env(safe-area-inset-bottom,0))] lg:shrink-0 lg:border-x lg:pb-0">
          <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#2f3336] bg-black/80 px-4 py-3 backdrop-blur-md">
            <div>
              <h1 className="text-xl font-bold text-[#e7e9ea]">メッセージ</h1>
              {canCreate && (
                <p className="text-[13px] text-[#71767b]">
                  {groups.length}件のグループ
                </p>
              )}
            </div>
            {canCreate && (
              <CreateGroupDialog initialCandidates={memberCandidates} />
            )}
          </header>

          <section aria-label="グループ一覧">
            {error || !groups ? (
              <p className="px-4 py-8 text-center text-[15px] text-[#f4212e]">
                {error ?? "グループを取得できませんでした"}
              </p>
            ) : (
              <GroupList groups={groups} />
            )}
          </section>
        </main>

        <div className="hidden w-[350px] shrink-0 lg:block">
          <HomeRightPanel />
        </div>
      </div>

      <HomeMobileNav />
    </div>
  );
}

export { GroupListView };
