import type { ReactNode } from "react";
import Link from "next/link";

import { IoHomeOutline } from "react-icons/io5";
import { HiSearch } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoIosMore } from "react-icons/io";
import { XLogoMark } from "@/components/home/x-logo-mark";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
};

const navItems: NavItem[] = [
  {
    label: "ホーム",
    href: "/home",
    icon: <IoHomeOutline className="size-[26px]" />,
    active: true,
  },
  {
    label: "話題を検索",
    href: "#",
    icon: <HiSearch className="size-[26px]" />,
  },
  {
    label: "通知",
    href: "#",
    icon: <IoNotificationsOutline className="size-[26px]" />,
  },
  {
    label: "メッセージ",
    href: "#",
    icon: <MdOutlineMailOutline className="size-[26px]" />,
  },
  {
    label: "プロフィール",
    href: "#",
    icon: <CgProfile className="size-[26px]" />,
  },
];

function HomeSidebar() {
  return (
    <div className="font-chirp flex h-full flex-col px-3">
      <div className="flex min-h-0 flex-1 flex-col">
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
        className="mt-auto mb-3 flex w-full max-w-[234px] shrink-0 items-center gap-3 rounded-full p-3 transition-colors hover:bg-[#181818]"
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
        <IoIosMore className="size-[26px] shrink-0 text-[#e7e9ea]" />
      </button>
    </div>
  );
}

export { HomeSidebar };
