#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { deriveChangedPaths } from './lib/git-changes.mjs';
import { validateMission } from './lib/mission.mjs';
import { parsePolicy } from './lib/policy.mjs';
import { validateChangedPaths } from './lib/scope.mjs';

const [missionPath, policyPath, baseSha, headSha] = process.argv.slice(2);
if (![missionPath, policyPath, baseSha, headSha].every(Boolean)) {
  throw new Error('usage: validate-committed-gate.mjs <mission.json> <policy.yml> <base-sha> <head-sha>');
}
const mission = validateMission(JSON.parse(await readFile(missionPath, 'utf8')));
parsePolicy(await readFile(policyPath, 'utf8'));
const changedPaths = deriveChangedPaths({ baseSha, headSha });
validateChangedPaths(changedPaths, mission, { scope_exceptions: [] });
console.log(`Shiploop committed inputs valid for ${headSha} (${changedPaths.length} changed paths)`);
