import type { ReactNode } from "react";
import Link from "next/link";

import {
  BellIcon,
  BookmarkIcon,
  HomeIcon,
  MailIcon,
  MoreIcon,
  SearchIcon,
  UserIcon,
} from "@/components/home/home-nav-icons";
import { XLogoMark } from "@/components/home/x-logo-mark";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
};

const navItems: NavItem[] = [
  { label: "ホーム", href: "/home", icon: <HomeIcon />, active: true },
  { label: "話題を検索", href: "#", icon: <SearchIcon /> },
  { label: "通知", href: "#", icon: <BellIcon /> },
  { label: "メッセージ", href: "#", icon: <MailIcon /> },
  { label: "ブックマーク", href: "#", icon: <BookmarkIcon /> },
  { label: "プロフィール", href: "#", icon: <UserIcon /> },
];

function HomeSidebar() {
  return (
    <header className="font-chirp sticky top-0 flex h-dvh flex-col px-3">
      <div className="flex flex-1 flex-col">
        <Link
          href="/home"
          className="mb-1 flex w-fit rounded-full p-3 transition-colors hover:bg-[#181818]"
          aria-label="ホーム"
        >
          <XLogoMark />
        </Link>

        <nav aria-label="メインメニュー" className="mt-1 flex flex-col">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex w-fit items-center gap-5 rounded-full px-4 py-3 transition-colors hover:bg-[#181818]",
                item.active && "font-bold",
              )}
            >
              <span
                className={cn("text-[#e7e9ea]", item.active && "scale-105")}
              >
                {item.icon}
              </span>
              <span className="text-xl text-[#e7e9ea]">{item.label}</span>
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="mt-4 h-[52px] w-[90%] max-w-[234px] rounded-full bg-[#eff3f4] text-[17px] font-bold text-[#0f1419] transition-colors hover:bg-[#d7dbdc]"
        >
          ポストする
        </button>
      </div>

      <button
        type="button"
        className="mb-3 flex w-full max-w-[234px] items-center gap-3 rounded-full p-3 transition-colors hover:bg-[#181818]"
      >
        <span
          className="size-10 shrink-0 rounded-full bg-[#536471]"
          aria-hidden
        />
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-[15px] font-bold text-[#e7e9ea]">
            ユーザー
          </span>
          <span className="block truncate text-[15px] text-[#71767b]">
            @user
          </span>
        </span>
        <MoreIcon className="shrink-0 text-[#e7e9ea]" />
      </button>
    </header>
  );
}

export { HomeSidebar };
