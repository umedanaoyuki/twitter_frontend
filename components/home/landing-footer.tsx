const footerLinks = [
  { label: "会社情報", href: "https://about.x.com" },
  { label: "Xアプリをダウンロード", href: "https://help.x.com/using-x/download-the-x-app" },
  { label: "ヘルプセンター", href: "https://help.x.com" },
  { label: "利用規約", href: "https://x.com/tos" },
  { label: "プライバシーポリシー", href: "https://x.com/privacy" },
  { label: "Cookieのポリシー", href: "https://support.x.com/articles/20170514" },
  { label: "アクセシビリティ", href: "https://help.x.com/resources/accessibility" },
];

function LandingFooter() {
  return (
    <footer className="font-chirp w-full px-4 py-6 text-[11px] text-[#536471]">
      <nav
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-2"
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
