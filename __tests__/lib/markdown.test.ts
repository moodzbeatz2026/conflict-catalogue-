import { describe, it, expect } from "vitest";
import { renderMarkdown } from "@/lib/markdown";

describe("renderMarkdown", () => {
  it("renders basic markdown to HTML", () => {
    const result = renderMarkdown("**bold text**");
    expect(result).toContain("<strong>bold text</strong>");
  });

  it("renders citation markers as superscript links", () => {
    const result = renderMarkdown("This was documented [1] by multiple sources [2].");
    expect(result).toContain('class="citation-ref"');
    expect(result).toContain("#source-1");
    expect(result).toContain("#source-2");
  });

  it("renders paragraphs", () => {
    const result = renderMarkdown("First paragraph.\n\nSecond paragraph.");
    expect(result).toContain("<p>");
    expect(result).toContain("First paragraph.");
    expect(result).toContain("Second paragraph.");
  });
});
