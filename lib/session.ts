export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME;

const API_BASE_URL = process.env.API_BASE_URL;

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

/** Gin が返す Set-Cookie をブラウザ用 Cookie に反映する */
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

export { API_BASE_URL };
