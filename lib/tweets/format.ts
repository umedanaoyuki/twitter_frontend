export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return "たった今";
  if (diffMinutes < 60) return `${diffMinutes}分`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}時間`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}日前`;

  return date.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

export function formatCount(count: number): string {
  if (count >= 10_000) {
    const value = count / 10_000;
    const formatted =
      value >= 10 ? Math.round(value).toString() : value.toFixed(1);
    return `${formatted.replace(/\.0$/, "")}万`;
  }

  return count.toLocaleString("ja-JP");
}

export function emailToDisplayName(email: string): string {
  const localPart = email.split("@")[0] ?? email;
  return localPart;
}
