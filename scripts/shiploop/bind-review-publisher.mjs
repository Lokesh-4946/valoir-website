#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) throw new Error('usage: bind-review-publisher.mjs <review-draft.json> <external-output.json>');
const review = JSON.parse(await readFile(inputPath, 'utf8'));
const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (review.reviewed_sha !== head) throw new Error('review draft must bind checked-out HEAD');
review.publisher = {
  entry_path: 'scripts/shiploop/publish-status.mjs',
  publisher_tree_sha: execFileSync('git', ['rev-parse', `${head}:scripts/shiploop`], { encoding: 'utf8' }).trim(),
};
await writeFile(outputPath, `${JSON.stringify(review, null, 2)}\n`, { flag: 'wx' });
console.log(outputPath);
