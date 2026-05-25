"use server";

import { register } from "@/lib/api/auth";
import type { SignupFormValues } from "@/lib/validation/signup";

export type RegisterState =
  | { error: string }
  | { success: true; message: string }
  | null;

export async function registerAction(
  values: SignupFormValues,
): Promise<RegisterState> {
  try {
    const response = await register({
      email: values.email.trim(),
      password: values.password,
    });

    const message = response.message;

    if (!message) {
      return { error: "登録に失敗しました" };
    }
    return {
      success: true,
      message,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "登録に失敗しました",
    };
  }
}
