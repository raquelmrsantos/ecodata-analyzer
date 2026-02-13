import { describe, it, expect } from "vitest";
import { cn } from "../lib/utils";

describe("utils.cn", () => {
  it("combines class names into a string", () => {
    const result = cn("foo", "bar", { baz: true, qux: false } as Record<
      string,
      boolean
    >);
    expect(typeof result).toBe("string");
    expect(result).toContain("foo");
    expect(result).toContain("bar");
    expect(result).toContain("baz");
  });
});
