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
  /** 表示しているプロフィールの持ち主のユーザーID */
  userId: number;
  /** ログイン中のユーザー自身のプロフィールかどうか（編集ボタンとフォローボタンの出し分けに使う） */
  isOwnProfile: boolean;
  /** ログイン中のユーザーがこのユーザーをフォロー済みかどうか */
  isFollowing: boolean;
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
