import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME;
export const USER_ID_COOKIE_NAME = "user_id";

export const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

export async function getSessionCookieHeader(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME as string);
  if (!session) return undefined;

  return `${session.name}=${session.value}`;
}

export async function getCurrentUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_ID_COOKIE_NAME)?.value;
  if (!userId) return null;

  const parsed = Number(userId);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function requireCurrentUserId(): Promise<number> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("ログインが必要です");
  }

  return userId;
}

export async function requireSessionCookieHeader(): Promise<string> {
  const cookieHeader = await getSessionCookieHeader();
  if (!cookieHeader) {
    throw new Error("ログインが必要です");
  }

  return cookieHeader;
}

type SetCookieFn = (
  name: string,
  value: string,
  options?: {
    path?: string;
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
  },
) => void;

/** Gin がNext.jsのサーバーに返してきた Set-Cookie をブラウザ用 Cookie に反映する処理 */
export function applySessionCookies(
  setCookieHeaders: string[],
  setCookie: SetCookieFn,
) {
  for (const header of setCookieHeaders) {
    const segments = header.split(";").map((segment) => segment.trim());
    const [name, ...valueParts] = segments[0].split("=");
    if (name !== SESSION_COOKIE_NAME) continue;

    const value = valueParts.join("=");
    const options: NonNullable<Parameters<SetCookieFn>[2]> = {};

    for (const segment of segments.slice(1)) {
      const [attr, attrValue] = segment.split("=");
      const key = attr.toLowerCase();

      if (key === "path" && attrValue) options.path = attrValue;
      if (key === "max-age" && attrValue) options.maxAge = Number(attrValue);
      if (key === "httponly") options.httpOnly = true;
      if (key === "secure") options.secure = true;
      if (key === "samesite" && attrValue) {
        options.sameSite = attrValue.toLowerCase() as "lax" | "strict" | "none";
      }
    }

    setCookie(name, decodeURIComponent(value), options);
  }
}

