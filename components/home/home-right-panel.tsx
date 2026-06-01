import { mockSuggestions, mockTrends } from "@/lib/mock/home-feed";

function HomeRightPanel() {
  return (
    <aside className="font-chirp hidden lg:block">
      <div className="sticky top-0 space-y-4 py-2 pr-4 pl-6">
        <section aria-label="検索">
          <label htmlFor="home-search" className="sr-only">
            検索
          </label>
          <div className="group flex items-center gap-3 rounded-full bg-[#202327] px-4 py-3 focus-within:bg-black focus-within:ring-1 focus-within:ring-[#1d9bf0]">
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="size-5 fill-[#71767b] group-focus-within:fill-[#1d9bf0]"
            >
              <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904l4.154 4.154 1.06-1.06-4.154-4.154A6.456 6.456 0 0 0 16.75 10.25c0-3.59-2.91-6.5-6.5-6.5zm-5 6.5a5 5 0 1 1 10 0 5 5 0 0 1-10 0z" />
            </svg>
            <input
              id="home-search"
              type="search"
              placeholder="検索"
              className="w-full bg-transparent text-[15px] text-[#e7e9ea] placeholder:text-[#71767b] focus:outline-none"
            />
          </div>
        </section>

        <section
          aria-labelledby="who-to-follow-heading"
          className="overflow-hidden rounded-2xl bg-[#16181c]"
        >
          <h2
            id="who-to-follow-heading"
            className="px-4 py-3 text-xl font-bold text-[#e7e9ea]"
          >
            おすすめユーザー
          </h2>
          <ul>
            {mockSuggestions.map((user) => (
              <li
                key={user.handle}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#1d1f23]"
              >
                <span
                  className="size-10 shrink-0 rounded-full"
                  style={{ backgroundColor: user.avatarColor }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-[#e7e9ea]">
                    {user.name}
                  </p>
                  <p className="truncate text-[15px] text-[#71767b]">
                    @{user.handle}
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-full bg-[#eff3f4] px-4 py-1.5 text-[14px] font-bold text-[#0f1419] hover:bg-[#d7dbdc]"
                >
                  フォロー
                </button>
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="block px-4 py-3 text-[15px] text-[#1d9bf0] hover:bg-[#1d1f23]"
          >
            さらに表示
          </a>
        </section>

        <footer className="px-4 text-[13px] leading-4 text-[#71767b]">
          <nav
            aria-label="フッターリンク"
            className="flex flex-wrap gap-x-3 gap-y-1"
          >
            <a href="#" className="hover:underline">
              利用規約
            </a>
            <a href="#" className="hover:underline">
              プライバシーポリシー
            </a>
            <a href="#" className="hover:underline">
              Cookieのポリシー
            </a>
            <a href="#" className="hover:underline">
              アクセシビリティ
            </a>
            <a href="#" className="hover:underline">
              広告情報
            </a>
            <span>© 2026 X Corp.</span>
          </nav>
        </footer>
      </div>
    </aside>
  );
}

export { HomeRightPanel };
