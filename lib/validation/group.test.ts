import { describe, expect, it } from "vitest";

import {
  MAX_GROUP_NAME_LENGTH,
  parseUserIdInput,
  validateGroupName,
  validateMemberUserIds,
} from "./group";

describe("validateGroupName", () => {
  it("accepts a normal name", () => {
    expect(validateGroupName("開発チーム")).toBeNull();
  });

  it("accepts a name at the maximum length", () => {
    expect(validateGroupName("あ".repeat(MAX_GROUP_NAME_LENGTH))).toBeNull();
  });

  it.each(["", "   ", "\n"])("rejects a blank name: %j", (name) => {
    expect(validateGroupName(name)).toBe("グループ名を入力してください");
  });

  it("rejects a name longer than the maximum length", () => {
    expect(validateGroupName("あ".repeat(MAX_GROUP_NAME_LENGTH + 1))).toBe(
      `グループ名は${MAX_GROUP_NAME_LENGTH}文字以内で入力してください`,
    );
  });
});

describe("validateMemberUserIds", () => {
  it("accepts one or more valid ids", () => {
    expect(validateMemberUserIds([2, 3])).toBeNull();
  });

  it("rejects an empty list", () => {
    expect(validateMemberUserIds([])).toBe("メンバーを1人以上選択してください");
  });

  it.each([0, -1, 1.5])("rejects an invalid id: %j", (id) => {
    expect(validateMemberUserIds([id])).toBe(
      "メンバーの指定が正しくありません",
    );
  });
});

describe("parseUserIdInput", () => {
  it("parses a positive integer", () => {
    expect(parseUserIdInput(" 42 ")).toBe(42);
  });

  it.each(["", "abc", "0", "-1", "1.5", "1e3"])(
    "returns null for invalid input: %j",
    (value) => {
      expect(parseUserIdInput(value)).toBeNull();
    },
  );
});
