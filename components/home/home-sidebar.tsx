"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { IoHomeOutline } from "react-icons/io5";
import { HiSearch } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaRegBookmark } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { DeleteAccountButton } from "@/components/home/delete-account-button";
import { LogoutButton } from "@/components/home/logout-button";
import { XLogoMark } from "@/components/home/x-logo-mark";
import { cn } from "@/lib/utils";

type NavLinkItem = {
  type: "link";
  label: string;
  href: string;
  icon: ReactNode;
};

type NavDeleteItem = {
  type: "delete";
  label: string;
};

type NavLogoutItem = {
  type: "logout";
  label: string;
};

type NavItem = NavLinkItem | NavDeleteItem | NavLogoutItem;

const navItems: NavItem[] = [
  {
    type: "link",
    label: "ホーム",
    href: "/home",
    icon: <IoHomeOutline className="size-[26px]" />,
  },
  {
    type: "link",
    label: "話題を検索",
    href: "#",
    icon: <HiSearch className="size-[26px]" />,
  },
  {
    type: "link",
    label: "通知",
    href: "#",
    icon: <IoNotificationsOutline className="size-[26px]" />,
  },
  {
    type: "link",
    label: "メッセージ",
    href: "#",
    icon: <MdOutlineMailOutline className="size-[26px]" />,
  },
  {
    type: "link",
    label: "プロフィール",
    href: "/profile",
    icon: <CgProfile className="size-[26px]" />,
  },
  {
    type: "link",
    label: "ブックマーク",
    href: "/bookmarks",
    icon: <FaRegBookmark className="size-[26px]" />,
  },
  {
    type: "logout",
    label: "ログアウト",
  },
  {
    type: "delete",
    label: "退会",
  },
];

function HomeSidebar() {
  // 表示中の画面のメニューを強調する（"#" のダミーリンクは常に非アクティブ）
  const pathname = usePathname();

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
          {navItems.map((item) => {
            if (item.type === "logout") {
              return <LogoutButton key={item.label} label={item.label} />;
            }

            if (item.type === "delete") {
              return (
                <DeleteAccountButton key={item.label} label={item.label} />
              );
            }

            const isActive = item.href !== "#" && pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex w-fit items-center gap-5 rounded-full px-4 py-3 transition-colors hover:bg-[#181818]",
                  isActive && "font-bold",
                )}
              >
                <span className={cn("text-[#e7e9ea]", isActive && "scale-105")}>
                  {item.icon}
                </span>
                <span className="text-xl text-[#e7e9ea]">{item.label}</span>
              </Link>
            );
          })}
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
