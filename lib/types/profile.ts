import type { TweetTimelineData } from "@/lib/types/tweet";

/** 編集フォームで扱うプロフィールの入力値 */
export type ProfileFormValues = {
  name: string;
  bio: string;
  location: string;
  imageUrl: string;
};

/** プロフィール画面の表示に使うビューモデル */
export type ProfileView = {
  /** プロフィールが未作成の場合は false（保存時に作成扱いにする） */
  exists: boolean;
  /** 表示名（プロフィール名 or メールのローカル部にフォールバック） */
  name: string;
  /** @から始まるハンドル表示に使う文字列 */
  handle: string;
  bio: string;
  location: string;
  imageUrl?: string;
  /** 「20XX年X月からXを利用しています」の表示文言 */
  joinedText: string;
  /** 編集フォームの初期値 */
  form: ProfileFormValues;
};

/** プロフィール画面全体のデータ */
export type ProfilePageData = {
  profile: ProfileView;
  timeline: TweetTimelineData;
};
