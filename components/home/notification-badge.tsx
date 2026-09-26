type NotificationBadgeProps = {
  /** 未読通知件数。0 以下なら何も表示しない */
  count: number;
};

/** 通知アイコンの右上に未読件数を重ねて表示するバッジ */
function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) return null;

  const label = count > 99 ? "99+" : String(count);

  return (
    <span
      className="absolute -top-1.5 left-1/2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-black bg-[#1d9bf0] px-1 text-[11px] leading-none font-bold text-white"
      aria-label={`未読の通知が${label}件あります`}
    >
      {label}
    </span>
  );
}

export { NotificationBadge };
