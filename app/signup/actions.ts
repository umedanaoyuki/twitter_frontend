"use server";

import { register } from "@/lib/api/auth";
import { actionClient } from "@/lib/safe-action";
import { signupFormSchema } from "@/lib/validation/signup";

export type RegisterState =
  | { error: string }
  | { success: true; message: string }
  | null;

export const createRegisterAction = actionClient
  .schema(signupFormSchema)
  .action(async ({ parsedInput: values }) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
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
  });
