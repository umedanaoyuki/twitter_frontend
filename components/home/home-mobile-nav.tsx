import type { ReactNode } from "react";
import Link from "next/link";

import { IoHomeOutline } from "react-icons/io5";
import { HiSearch } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { NotificationBadge } from "@/components/home/notification-badge";
import { getUnreadNotificationCount } from "@/lib/notifications/get-unread-notification-count";
import { cn } from "@/lib/utils";

type MobileNavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
  /** 未読通知件数のバッジをアイコンに重ねるかどうか */
  showNotificationBadge?: boolean;
};

const mobileNavItems: MobileNavItem[] = [
  {
    label: "ホーム",
    href: "/home",
    icon: <IoHomeOutline className="size-[26px]" />,
    active: true,
  },
  { label: "検索", href: "#", icon: <HiSearch className="size-[26px]" /> },
  {
    label: "通知",
    href: "/notifications",
    icon: <IoNotificationsOutline className="size-[26px]" />,
    showNotificationBadge: true,
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

/** モバイル用の下部ナビ。未読通知件数はサーバー側で取得する */
async function HomeMobileNav() {
  const unreadNotificationCount = await getUnreadNotificationCount();

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
              <span
                className={cn(
                  "relative block",
                  !item.active && "text-[#71767b]",
                )}
              >
                {item.icon}
                {item.showNotificationBadge && (
                  <NotificationBadge count={unreadNotificationCount} />
                )}
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
