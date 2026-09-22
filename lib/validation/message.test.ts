import { describe, expect, it } from "vitest";

import {
  getMessageLength,
  MAX_MESSAGE_LENGTH,
  validateMessageContent,
} from "./message";

describe("getMessageLength", () => {
  it("counts surrogate pairs as one character", () => {
    expect(getMessageLength("👍👍")).toBe(2);
  });
});

describe("validateMessageContent", () => {
  it("accepts normal content", () => {
    expect(validateMessageContent("こんにちは")).toBeNull();
  });

  it("accepts content at the maximum length", () => {
    expect(validateMessageContent("あ".repeat(MAX_MESSAGE_LENGTH))).toBeNull();
  });

  it.each(["", "   ", "\n"])("rejects blank content: %j", (content) => {
    expect(validateMessageContent(content)).toBe(
      "メッセージを入力してください",
    );
  });

  it("rejects content longer than the maximum length", () => {
    expect(validateMessageContent("あ".repeat(MAX_MESSAGE_LENGTH + 1))).toBe(
      `メッセージは${MAX_MESSAGE_LENGTH}文字以内で入力してください`,
    );
  });
});
