import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function isMonochromeHex(hex: string): boolean {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    return clean[0] === clean[1] && clean[1] === clean[2];
  }
  if (clean.length === 6) {
    return clean.slice(0, 2) === clean.slice(2, 4) && clean.slice(2, 4) === clean.slice(4, 6);
  }
  return false;
}

describe("Monochrome theme tokens in globals.css", () => {
  it("uses strictly monochrome hex colors for :root and .dark tokens", () => {
    const cssPath = path.resolve(process.cwd(), "src/app/globals.css");
    const css = fs.readFileSync(cssPath, "utf8");

    expect(css).toContain(":root {");
    expect(css).toContain(".dark {");

    const hexMatches = css.match(/#[0-9a-fA-F]{3,6}/g) ?? [];
    expect(hexMatches.length).toBeGreaterThan(20);
    for (const hex of hexMatches) {
      expect(isMonochromeHex(hex)).toBe(true);
    }
  });
});
