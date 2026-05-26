import Link from "next/link";

import { AppleIcon, GoogleIcon } from "@/components/home/icons";
import { LandingFooter } from "@/components/home/landing-footer";
import { XHeroLogo } from "@/components/home/x-hero-logo";
function SsoButton({
  children,
  icon,
  href = "#",
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="font-chirp flex h-10 w-full max-w-[300px] items-center justify-center gap-2 rounded-full border border-[#536471] bg-black px-4 text-[15px] font-bold text-[#e7e9ea] transition-colors hover:bg-[#181818]"
    >
      <span className="flex size-5 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="truncate">{children}</span>
    </a>
  );
}

function Divider() {
  return (
    <div className="font-chirp my-3 flex w-full max-w-[300px] items-center gap-3">
      <span className="h-px flex-1 bg-[#2f3336]" />
      <span className="text-[15px] text-[#e7e9ea]">または</span>
      <span className="h-px flex-1 bg-[#2f3336]" />
    </div>
  );
}

function LandingCta() {
  return (
    <div className="font-chirp flex w-full max-w-[600px] flex-col max-lg:items-center">
      <h1 className="mb-8 font-bold text-[#e7e9ea] max-lg:text-center max-lg:text-xl max-lg:leading-snug lg:text-[3.5rem] lg:leading-[0.9] lg:tracking-tight">
        <span className="lg:hidden">「いま」起きていることを見つけよう</span>
        <span className="hidden lg:inline">すべての話題が、ここに。</span>
      </h1>

      <div className="mb-8">
        <span className="mb-8 font-bold text-[#e7e9ea] max-lg:text-center max-lg:text-xl max-lg:leading-snug lg:text-[1.5rem] lg:leading-[0.9] lg:tracking-tight">
          今すぐ参加しましょう。
        </span>
      </div>

      <div className="flex w-full max-w-[300px] flex-col max-lg:items-center">
        <SsoButton icon={<GoogleIcon className="size-5" />}>
          Googleで登録
        </SsoButton>
        <div className="h-3" />
        <SsoButton icon={<AppleIcon className="size-5" />}>
          Appleのアカウントで登録
        </SsoButton>

        <Divider />

        <Link
          href="/signup"
          className="font-chirp flex h-10 w-full max-w-[300px] items-center justify-center rounded-full bg-[#eff3f4] px-4 text-[15px] font-bold text-[#0f1419] transition-colors hover:bg-[#d7dbdc]"
        >
          アカウントを作成
        </Link>

        <p className="mt-3 max-w-[300px] text-center text-[11px] leading-4 text-[#71767b]">
          アカウントを登録することにより、
          <a
            href="https://x.com/tos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1d9bf0] hover:underline"
          >
            利用規約
          </a>
          と
          <a
            href="https://x.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1d9bf0] hover:underline"
          >
            プライバシーポリシー
          </a>
          （
          <a
            href="https://support.x.com/articles/20170514"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1d9bf0] hover:underline"
          >
            Cookieの使用
          </a>
          を含む）に同意したとみなされます。
        </p>

        <div className="mt-10 w-full max-w-[300px]">
          <p className="mb-3 text-[17px] font-bold text-[#e7e9ea]">
            アカウントをお持ちの場合
          </p>
          <Link
            href="/login"
            className="font-chirp flex h-10 w-full items-center justify-center rounded-full border border-[#536471] bg-black px-4 text-[15px] font-bold text-[#eff3f4] transition-colors hover:bg-[#181818]"
          >
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="font-chirp flex min-h-screen flex-col bg-black text-[#e7e9ea]">
      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col lg:flex-row lg:items-center lg:justify-center lg:px-4">
        {/* SP: ヒーローロゴ */}
        <div className="flex justify-center px-6 pt-8 lg:hidden">
          <XHeroLogo tiny />
        </div>

        {/* PC: ヒーローロゴ */}
        <section className="hidden min-h-[45vh] flex-1 items-center justify-end pr-4 lg:flex">
          <XHeroLogo />
        </section>

        {/* CTA */}
        <section className="flex flex-1 items-center justify-center px-6 py-6 sm:px-8 lg:py-12">
          <div className="flex w-full justify-center max-lg:max-w-[400px]">
            <LandingCta />
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}

export { LandingPage };
