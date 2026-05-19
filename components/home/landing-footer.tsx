const footerLinks = [
  { label: "会社情報", href: "https://about.x.com" },
  {
    label: "Xアプリをダウンロード",
    href: "https://help.x.com/using-x/download-the-x-app",
  },
  { label: "Grok", href: "https://business.x.com" },
  { label: "ヘルプセンター", href: "https://help.x.com" },
  { label: "利用規約", href: "https://x.com/tos" },
  { label: "プライバシーポリシー", href: "https://x.com/privacy" },
  {
    label: "Cookieのポリシー",
    href: "https://support.x.com/articles/20170514",
  },
  {
    label: "アクセシビリティ",
    href: "https://help.x.com/resources/accessibility",
  },
  {
    label: "広告情報",
    href: "https://business.x.com/en/help/troubleshooting/how-x-ads-work",
  },
  {
    label: "ブログ",
    href: "https://x.com/",
  },
  {
    label: "採用情報",
    href: "https://x.ai/careers",
  },
  {
    label: "ブランドリソース",
    href: "https://about.x.com/ja/company/brand-resources",
  },
  {
    label: "広告",
    href: "https://business.x.com/ja/advertising?ref=gl-tw-tw-twitter-advertise",
  },
  {
    label: "マーケティング",
    href: "https://marketing.x.com/ja",
  },
  {
    label: "Xのビジネス活用",
    href: "https://business.x.com/ja?ref=web-twc-ao-gbl-twitterforbusiness&utm_source=twc&utm_medium=web&utm_campaign=ao&utm_content=twitterforbusiness",
  },
  {
    label: "開発者",
    href: "https://developer.x.com/",
  },
  {
    label: "ニュース",
    href: "https://x.com/i/jf/stories/home",
  },
  {
    label: "設定",
    href: "/settings",
  },
];

function LandingFooter() {
  return (
    <footer className="font-chirp w-full px-4 py-6 text-[11px] text-[#536471]">
      <nav
        className="mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
        aria-label="フッターナビゲーション"
      >
        {footerLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {link.label}
          </a>
        ))}
        <span className="w-full text-center sm:w-auto">
          © {new Date().getFullYear()} X Corp.
        </span>
      </nav>
    </footer>
  );
}

export { LandingFooter };
