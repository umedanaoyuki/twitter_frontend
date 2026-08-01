import { cache } from "react";

import { getUserRetweets } from "@/lib/api/tweets";
import type { ApiTweet } from "@/lib/api/types";
import { getCurrentUserId } from "@/lib/users/get-current-user";

const PAGE_LIMIT = 100;
/** リツイートが極端に多いユーザーでもリクエストが際限なく増えないようにする上限 */
const MAX_PAGES = 5;

/**
 * ログイン中のユーザーがリツイートしたツイートを、リツイートした順（新しい順）で取得する。
 *
 * ボタンの表示やタイムラインの並びに使うだけの情報なので、
 * 取得に失敗しても例外は投げず、そこまでに取れた分を返す。
 * cache() で包んでいるので、同じリクエスト内で何度呼んでもAPIアクセスは1回だけ。
 */
export const getMyRetweets = cache(async (): Promise<ApiTweet[]> => {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return [];

  const retweetedTweets: ApiTweet[] = [];

  try {
    let cursor: number | undefined;

    for (let page = 0; page < MAX_PAGES; page++) {
      const response = await getUserRetweets(currentUserId, {
        cursor,
        limit: PAGE_LIMIT,
      });

      for (const item of response.retweets ?? []) {
        if (item.tweet) {
          retweetedTweets.push(item.tweet);
        }
      }

      if (!response.has_more || response.next_cursor == null) break;
      cursor = response.next_cursor;
    }
  } catch {
    return retweetedTweets;
  }

  return retweetedTweets;
});

/**
 * ログイン中のユーザーがリツイート済みのツイートIDを取得する。
 *
 * バックエンドのツイート取得APIは「自分がリツイート済みか」を返さないため、
 * リツイート一覧から突き合わせている。
 * （ツイート側に is_retweeted のようなフィールドが増えたら、そちらに寄せるのが望ましい）
 */
export const getRetweetedTweetIds = cache(async (): Promise<Set<number>> => {
  const retweetedTweets = await getMyRetweets();

  return new Set(
    retweetedTweets
      .map((tweet) => tweet.id)
      .filter((id): id is number => id != null),
  );
});
