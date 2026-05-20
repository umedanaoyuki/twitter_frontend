"use server";

import { register } from "@/lib/api/auth";

export type RegisterState = {
  error?: string;
  success?: boolean;
  message?: string;
} | null;

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  console.log("registerActionです");
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
    return {
      success: true,
      message: response.message ?? "登録が完了しました",
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "登録に失敗しました",
    };
  }
}
