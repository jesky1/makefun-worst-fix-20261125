import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Worst Fix Ever: Funniest Commit Message — one line of commit message for a bug fix that made everything worse.
// Gate (competition.yaml): /output/entry.txt, UTF-8, 1-100 characters, not only whitespace.
const ENTRY =
  "fix: stopped the leak by removing the floor. Water drains great now. So does everything else.";

function validateEntry(text: string): void {
  if (text.length < 1 || text.length > 100) {
    throw new Error(`entry must be 1-100 characters, got ${text.length}`);
  }
  if (!text.trim()) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

validateEntry(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
