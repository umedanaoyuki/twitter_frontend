import type { ReactNode } from "react";
import Link from "next/link";

import {
  BellIcon,
  HomeIcon,
  MailIcon,
  SearchIcon,
  UserIcon,
} from "@/components/home/home-nav-icons";
import { cn } from "@/lib/utils";

type MobileNavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
};

const mobileNavItems: MobileNavItem[] = [
  { label: "ホーム", href: "/home", icon: <HomeIcon className="size-[26px]" />, active: true },
  { label: "検索", href: "#", icon: <SearchIcon className="size-[26px]" /> },
  { label: "通知", href: "#", icon: <BellIcon className="size-[26px]" /> },
  { label: "メッセージ", href: "#", icon: <MailIcon className="size-[26px]" /> },
  { label: "プロフィール", href: "#", icon: <UserIcon className="size-[26px]" /> },
];

function HomeMobileNav() {
  return (
    <nav
      aria-label="モバイルメニュー"
      className="font-chirp fixed inset-x-0 bottom-0 z-50 border-t border-[#2f3336] bg-black pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
    >
      <ul className="flex items-center justify-around px-2 py-1">
        {mobileNavItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-full px-3 py-2 text-[#e7e9ea] transition-colors hover:bg-[#181818]",
                item.active && "text-[#e7e9ea]",
              )}
              aria-current={item.active ? "page" : undefined}
            >
              <span className={cn(!item.active && "text-[#71767b]")}>
                {item.icon}
              </span>
              <span className="sr-only">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { HomeMobileNav };
