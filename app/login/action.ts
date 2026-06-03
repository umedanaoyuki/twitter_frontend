"use server";

import { cookies } from "next/headers";

import { applySessionCookies } from "@/lib/session";
import type { LoginFormValues } from "@/lib/validation/login";
import { login } from "@/lib/api/auth";

export type LoginState =
  | { error: string }
  | { success: true; message: string }
  | null;

export async function loginAction(
  values: LoginFormValues,
): Promise<LoginState> {
  try {
    const { data, setCookieHeaders } = await login({
      email: values.email,
      password: values.password,
    });

    const message = data.message;

    if (!message) {
      return { error: "ログインに失敗しました" };
    }
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
