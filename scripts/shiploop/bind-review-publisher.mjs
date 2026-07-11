#!/usr/bin/env node
import { bindReviewPublisher } from './lib/review-publisher.mjs';

const [inputPath, outputPath, repositoryRoot = process.cwd()] = process.argv.slice(2);
if (!inputPath || !outputPath) throw new Error('usage: bind-review-publisher.mjs <review-draft.json> <external-output.json>');
console.log(await bindReviewPublisher({ inputPath, outputPath, repositoryRoot }));
