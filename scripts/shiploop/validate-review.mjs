#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { validateMission } from './lib/mission.mjs';
import { parsePolicy } from './lib/policy.mjs';
import { validateReview } from './lib/review.mjs';

const [reviewPath, missionPath, policyPath, headSha, baseSha] = process.argv.slice(2);
if (![reviewPath, missionPath, policyPath, headSha, baseSha].every(Boolean)) throw new Error('usage: validate-review.mjs <review.json> <mission.json> <policy.yml> <head-sha> <base-sha>');
const review = JSON.parse(await readFile(reviewPath, 'utf8'));
const mission = validateMission(JSON.parse(await readFile(missionPath, 'utf8')));
const policy = parsePolicy(await readFile(policyPath, 'utf8'));
validateReview(review, { mission, policy, headSha, baseSha });
console.log('Shiploop review valid');
