"use server";

import { cookies } from "next/headers";

import { getApiErrorMessage } from "@/lib/api/errors";
import type { ErrorResponse } from "@/lib/api/types";
import { API_BASE_URL, applySessionCookies } from "@/lib/session";
import type { LoginFormValues } from "@/lib/validation/login";

export type LoginState =
  | { error: string }
  | { success: true; message: string }
  | null;

export async function loginAction(
  values: LoginFormValues,
): Promise<LoginState> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email.trim(),
        password: values.password,
      }),
    });

    if (!response.ok) {
      const error = (await response.json()) as ErrorResponse;
      return { error: getApiErrorMessage(error, response.status) };
    }

    const data = (await response.json()) as { message?: string };
    const message = data.message;

    if (!message) {
      return { error: "ログインに失敗しました" };
    }

    const setCookieHeaders = response.headers.getSetCookie();
    if (setCookieHeaders.length > 0) {
      const cookieStore = await cookies();
      applySessionCookies(setCookieHeaders, (name, value, options) => {
        cookieStore.set(name, value, options);
      });
    }

    return {
      success: true,
      message,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "ログインに失敗しました",
    };
  }
}
