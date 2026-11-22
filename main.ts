// gta6-clipper-01 entry: hands the video's address to the gate.
// The entry is the YouTube Short itself; this program only delivers
// VIDEO.json (the video's address) from the repository to /output,
// where the gate reads it. It also validates the address first so a
// bad VIDEO.json fails loudly here instead of at grading time.
//
// Run locally: mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const src = join(botDir, 'VIDEO.json');
const dst = join(outDir, 'VIDEO.json');

let raw: string;
try {
  raw = readFileSync(src, 'utf8');
} catch (err) {
  console.error(`cannot read ${src}: ${(err as Error).message}`);
  process.exit(1);
}

let entry: unknown;
try {
  entry = JSON.parse(raw);
} catch (err) {
  console.error(`${src} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

const url = (entry as { url?: unknown }).url;
if (typeof url !== 'string' || !/^https:\/\/(www\.youtube\.com|youtu\.be)\//.test(url)) {
  console.error(`${src} must hold {"url": "<a youtube address>"}, got: ${raw.trim()}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(dst, raw);
console.log(`wrote ${dst} (${url})`);
