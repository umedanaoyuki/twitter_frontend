import { TweetCard } from "@/components/home/tweet-card";
import { mockTweets } from "@/lib/mock/home-feed";
import { cn } from "@/lib/utils";

const tabs = ["おすすめ", "フォロー中"] as const;

function HomeFeed() {
  return (
    <main className="font-chirp min-h-dvh w-full min-w-0 border-[#2f3336] pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:border-x lg:pb-0">
      <header className="sticky top-0 z-10 border-b border-[#2f3336] bg-black/80 backdrop-blur-md">
        <h1 className="px-4 py-3 text-xl font-bold text-[#e7e9ea]">ホーム</h1>
        <nav
          aria-label="タイムラインの種類"
          className="grid grid-cols-2 border-b border-[#2f3336]"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={cn(
                "relative py-4 text-[15px] transition-colors hover:bg-[#181818]",
                index === 0
                  ? "font-bold text-[#e7e9ea]"
                  : "font-medium text-[#71767b]",
              )}
            >
              {tab}
              {index === 0 && (
                <span className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-[#1d9bf0]" />
              )}
            </button>
          ))}
        </nav>
      </header>

      <section aria-label="ポストを作成" className="border-b border-[#2f3336] px-4 py-3">
        <div className="flex gap-3">
          <div
            className="size-10 shrink-0 rounded-full bg-[#536471]"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <label htmlFor="compose-input" className="sr-only">
              いまどうしてる？
            </label>
            <textarea
              id="compose-input"
              rows={2}
              placeholder="いまどうしてる？"
              className="w-full resize-none bg-transparent text-xl text-[#e7e9ea] placeholder:text-[#71767b] focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-between border-t border-[#2f3336] pt-3">
              <div className="flex gap-1 text-[#1d9bf0]">
                <button
                  type="button"
                  aria-label="画像を追加"
                  className="rounded-full p-2 transition-colors hover:bg-[#1d9bf0]/10"
                >
                  <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-current">
                    <path d="M8.75 3h-5.5A2.25 2.25 0 0 0 1 5.25v13.5A2.25 2.25 0 0 0 3.25 21h17.5A2.25 2.25 0 0 0 23 18.75V8.75A2.25 2.25 0 0 0 20.75 6.5h-7.836a1.25 1.25 0 0 1-.87-.354l-1.88-1.88A1.25 1.25 0 0 0 9.774 4H8.75zm-5.5 1.5h5.5a.75.75 0 0 1 .53.22l1.88 1.88c.14.14.33.22.53.22h7.836c.414 0 .75.336.75.75v10c0 .414-.336.75-.75.75H3.25a.75.75 0 0 1-.75-.75V5.25c0-.414.336-.75.75-.75z" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="GIFを追加"
                  className="rounded-full p-2 text-[13px] font-bold transition-colors hover:bg-[#1d9bf0]/10"
                >
                  GIF
                </button>
              </div>
              <button
                type="button"
                disabled
                className="rounded-full bg-[#1d9bf0] px-4 py-1.5 text-[15px] font-bold text-white opacity-50"
              >
                ポストする
              </button>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="タイムライン">
        {mockTweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </section>
    </main>
  );
}

export { HomeFeed };
