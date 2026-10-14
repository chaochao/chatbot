// Token usage for this project's Claude Code sessions. Run: node usage.mjs [label]
// Prints a markdown row for DEVELOP.md "Usage". Dedupes by message id (log repeats per content block).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const dir = join(
  homedir(),
  ".claude/projects",
  process.cwd().replace(/[/.]/g, "-")
);
const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) {
      walk(p);
    } else if (f.endsWith(".jsonl")) {
      files.push(p);
    }
  }
};
walk(dir);

const seen = new Map();
for (const f of files) {
  for (const line of readFileSync(f, "utf8").split("\n")) {
    if (!line.includes('"usage"')) {
      continue;
    }
    try {
      const m = JSON.parse(line).message;
      if (m?.id && m.usage) {
        seen.set(m.id, m.usage);
      }
    } catch {
      // skip partial lines (log may be mid-write)
    }
  }
}

const t = { cacheR: 0, cacheW: 0, in: 0, out: 0 };
for (const u of seen.values()) {
  t.in += u.input_tokens ?? 0;
  t.out += u.output_tokens ?? 0;
  t.cacheW += u.cache_creation_input_tokens ?? 0;
  t.cacheR += u.cache_read_input_tokens ?? 0;
}
// ponytail: flat Opus list price ($/MTok: in 5, out 25, cache write 1h 10, cache read 0.5); edit if model or pricing changes
const usd = (t.in * 5 + t.out * 25 + t.cacheW * 10 + t.cacheR * 0.5) / 1e6;
const k = (n) => `${(n / 1000).toFixed(1)}k`;
const time = new Date().toTimeString().slice(0, 5);
console.log(
  `| ${time} | ${process.argv[2] ?? ""} | ${seen.size} | ${k(t.in)} | ${k(t.out)} | ${k(t.cacheW)} | ${k(t.cacheR)} | ~$${usd.toFixed(2)} |`
);
