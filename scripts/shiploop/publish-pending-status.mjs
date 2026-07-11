#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { deriveChangedPaths } from './lib/git-changes.mjs';
import { validateMission } from './lib/mission.mjs';
import { parsePolicy } from './lib/policy.mjs';
import { verifyPublicationTarget } from './lib/publication.mjs';
import { validateChangedPaths } from './lib/scope.mjs';

function run(command, args) {
  return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
}

const [prNumber, missionPath = '.valoir/mission-contract.json', policyPath = '.valoir/review-policy.yml'] = process.argv.slice(2);
if (!prNumber) throw new Error('usage: publish-pending-status.mjs <pr-number> [mission.json] [policy.yml]');
const mission = validateMission(JSON.parse(await readFile(missionPath, 'utf8')));
parsePolicy(await readFile(policyPath, 'utf8'));
const checkedOutSha = run('git', ['rev-parse', 'HEAD']);
const pr = JSON.parse(run('gh', ['pr', 'view', prNumber, '--json', 'baseRefOid,headRefOid,url']));
await verifyPublicationTarget({ requestedSha: checkedOutSha, checkedOutSha, remotePrHeadSha: pr.headRefOid });
const changedPaths = deriveChangedPaths({ baseSha: pr.baseRefOid, headSha: checkedOutSha });
validateChangedPaths(changedPaths, mission, { scope_exceptions: [] });
const repository = run('gh', ['repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner']);
run('gh', ['api', `repos/${repository}/statuses/${checkedOutSha}`, '--method', 'POST', '-f', 'state=pending', '-f', 'context=valoir-shiploop', '-f', 'description=Independent exact-SHA review and runtime certificate pending', '-f', `target_url=${pr.url}`]);
run('gh', ['pr', 'comment', prNumber, '--body', `Valoir Shiploop: deterministic committed gate is valid for exact SHA \`${checkedOutSha}\`. Independent review and the external runtime certificate are pending.`]);
console.log(`Published valoir-shiploop pending for ${checkedOutSha}`);
