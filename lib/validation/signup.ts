import { z } from "zod";

const PASSWORD_CHARS_PATTERN = /^[a-zA-Z0-9!?_-]+$/;
const PASSWORD_SYMBOLS = "!?-_";

function hasPasswordSymbol(password: string): boolean {
  return [...password].some((char) => PASSWORD_SYMBOLS.includes(char));
}

export const signupFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください")
    .pipe(z.email("有効なメールアドレスを入力してください")),
  password: z.string().superRefine((password, ctx) => {
    if (!password) {
      ctx.addIssue({
        code: "custom",
        message: "パスワードを入力してください",
      });
      return;
    }
    if (password.length < 8 || password.length > 15) {
      ctx.addIssue({
        code: "custom",
        message: "パスワードは8文字以上15文字以下である必要があります",
      });
      return;
    }
    if (!PASSWORD_CHARS_PATTERN.test(password)) {
      ctx.addIssue({
        code: "custom",
        message: "パスワードは半角英数字と記号(!?-_)のみ使用できます",
      });
      return;
    }
    if (!/[a-z]/.test(password)) {
      ctx.addIssue({
        code: "custom",
        message: "パスワードには小文字を含める必要があります",
      });
      return;
    }
    if (!/[A-Z]/.test(password)) {
      ctx.addIssue({
        code: "custom",
        message: "パスワードには大文字を含める必要があります",
      });
      return;
    }
    if (!/[0-9]/.test(password)) {
      ctx.addIssue({
        code: "custom",
        message: "パスワードには数字を含める必要があります",
      });
      return;
    }
    if (!hasPasswordSymbol(password)) {
      ctx.addIssue({
        code: "custom",
        message: "パスワードには記号(!?-_)を1文字以上含める必要があります",
      });
    }
  }),
});
