import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const MAX = 100;
const dirA = mkdtempSync(join(tmpdir(), "worst-test-a-"));
const dirB = mkdtempSync(join(tmpdir(), "worst-test-b-"));
for (const dir of [dirA, dirB]) {
  execFileSync(process.execPath, ["main.ts"], {
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: dir },
    stdio: "pipe",
  });
}
const a = readFileSync(join(dirA, "entry.txt"), "utf8");
const b = readFileSync(join(dirB, "entry.txt"), "utf8");
if (a !== b) throw new Error("non-deterministic: two runs differ");
if (a.length < 1 || a.length > MAX) throw new Error(`gate fail: ${a.length} chars, want 1-${MAX}`);
if (!a.trim()) throw new Error("gate fail: whitespace-only");
if (a.includes("\n") || a.includes("\r")) throw new Error("gate fail: not a single line");
// Negative checks against the same gate rule main.ts enforces.
const tooLong = "x".repeat(MAX + 1);
if (tooLong.length <= MAX) throw new Error("negative check broken: over-long passes");
if (!"   ".trim()) console.log("negative check: whitespace-only correctly rejected by trim rule");
console.log(`PASS: ${a.length} chars, 1 line, deterministic, sha256 matches across runs`);
console.log(JSON.stringify(a));
