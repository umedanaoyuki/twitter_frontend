"use server";

import { register } from "@/lib/api/auth";

export type RegisterState =
  | { error: string }
  | { success: true; message: string }
  | null;

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.trim()) {
    return { error: "メールアドレスを入力してください" };
  }
  if (typeof password !== "string" || !password) {
    return { error: "パスワードを入力してください" };
  }

  try {
    const response = await register({
      email: email.trim(),
      password,
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
