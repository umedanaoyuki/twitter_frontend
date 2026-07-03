/**
 * ISO形式の日時を「たった今 / ○分 / ○時間 / ○日前」といった相対表記に変換する。
 * 7日以上前は「M月D日」形式の絶対表記にフォールバックする。
 */
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

/**
 * いいね数などの件数を表示用に整形する。
 * 1万以上は「1.2万」のように万単位へ丸め、それ未満は桁区切り付きで返す。
 */
export function formatCount(count: number): string {
  if (count >= 10_000) {
    const value = count / 10_000;
    const formatted =
      value >= 10 ? Math.round(value).toString() : value.toFixed(1);
    return `${formatted.replace(/\.0$/, "")}万`;
  }

  return count.toLocaleString("ja-JP");
}

/**
 * メールアドレスのローカル部（@より前）を表示名として取り出す。
 * @が含まれない場合は元の文字列をそのまま返す。
 */
export function emailToDisplayName(email: string): string {
  const localPart = email.split("@")[0] ?? email;
  return localPart;
}
