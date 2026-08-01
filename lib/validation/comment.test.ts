import { describe, expect, it } from "vitest";

import {
  getCommentLength,
  MAX_COMMENT_LENGTH,
  validateCommentContent,
} from "./comment";

describe("getCommentLength", () => {
  it("counts surrogate pairs as one character", () => {
    expect(getCommentLength("👍👍")).toBe(2);
  });
});

describe("validateCommentContent", () => {
  it("accepts normal content", () => {
    expect(validateCommentContent("いいツイートですね！")).toBeNull();
  });

  it("accepts content at the maximum length", () => {
    expect(validateCommentContent("あ".repeat(MAX_COMMENT_LENGTH))).toBeNull();
  });

  it.each(["", "   ", "\n"])("rejects blank content: %j", (content) => {
    expect(validateCommentContent(content)).toBe(
      "コメント内容を入力してください",
    );
  });

  it("rejects content longer than the maximum length", () => {
    expect(validateCommentContent("あ".repeat(MAX_COMMENT_LENGTH + 1))).toBe(
      `コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください`,
    );
  });
});
