import { describe, expect, it } from "vitest";
import { z } from "zod";

import { signupFormSchema } from "./signup";

const validInput = {
  email: "user@example.com",
  password: "Password1!",
} as const;

function parseSignup(input: { email: string; password: string }) {
  return signupFormSchema.safeParse(input);
}

function getIssueMessage(
  error: z.ZodError,
  path: keyof typeof validInput,
): string | undefined {
  return error.issues.find((issue) => issue.path[0] === path)?.message;
}

describe("signupFormSchema", () => {
  describe("valid input", () => {
    it("accepts valid email and password", () => {
      const result = parseSignup(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe("email", () => {
    it("rejects empty email", () => {
      const result = parseSignup({ ...validInput, email: "" });

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(getIssueMessage(result.error, "email")).toBe(
        "メールアドレスを入力してください",
      );
    });

    it("rejects invalid email format", () => {
      const result = parseSignup({ ...validInput, email: "not-an-email" });

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(getIssueMessage(result.error, "email")).toBe(
        "有効なメールアドレスを入力してください",
      );
    });

  });

  describe("password", () => {
    it("rejects empty password", () => {
      const result = parseSignup({ ...validInput, password: "" });

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(getIssueMessage(result.error, "password")).toBe(
        "パスワードを入力してください",
      );
    });

    it.each([
      {
        password: "Pass1!",
        message: "パスワードは8文字以上15文字以下である必要があります",
      },
      {
        password: "Password1!Password1!",
        message: "パスワードは8文字以上15文字以下である必要があります",
      },
      {
        password: "password1!",
        message: "パスワードには大文字を含める必要があります",
      },
      {
        password: "PASSWORD1!",
        message: "パスワードには小文字を含める必要があります",
      },
      {
        password: "Password!",
        message: "パスワードには数字を含める必要があります",
      },
      {
        password: "Password1",
        message: "パスワードには記号(!?-_)を1文字以上含める必要があります",
      },
      {
        password: "Password1！",
        message: "パスワードは半角英数字と記号(!?-_)のみ使用できます",
      },
    ])("rejects password: $password", ({ password, message }) => {
      const result = parseSignup({ ...validInput, password });

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(getIssueMessage(result.error, "password")).toBe(message);
    });
  });
});
