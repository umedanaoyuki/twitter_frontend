"use server";

import { login } from "@/lib/api/auth";
import type { SignupFormValues } from "@/lib/validation/signup";

export type LoginState =
  | { error: string }
  | { success: true; message: string }
  | null;

export async function loginAction(
  values: SignupFormValues,
): Promise<LoginState> {
  try {
    const response = await login({
      email: values.email.trim(),
      password: values.password,
    });

    const message = response.message;

    if (!message) {
      return { error: "ログインに失敗しました" };
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
