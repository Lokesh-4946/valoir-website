#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { validateCertificate } from './lib/certificate.mjs';
import { deriveChangedPaths } from './lib/git-changes.mjs';
import { validateMission } from './lib/mission.mjs';
import { parsePolicy } from './lib/policy.mjs';
import { verifyPublicationTarget } from './lib/publication.mjs';
import { requireExternalEvidencePath } from './lib/runtime-evidence.mjs';

function run(command, args) {
  return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
}

const [prNumber, certificatePath, missionPath, reviewPath, policyPath, uiChangesValue] = process.argv.slice(2);
if (![prNumber, certificatePath, missionPath, reviewPath, policyPath, uiChangesValue].every(Boolean)) {
  throw new Error('usage: publish-status.mjs <pr-number> <certificate.json> <mission.json> <review.json> <policy.yml> <ui-changes:true|false>');
}
if (!['true', 'false'].includes(uiChangesValue)) throw new Error('ui-changes must be true or false');
requireExternalEvidencePath(certificatePath);
requireExternalEvidencePath(reviewPath);
const [certificate, mission, review, policySource] = await Promise.all([
  readFile(certificatePath, 'utf8').then(JSON.parse),
  readFile(missionPath, 'utf8').then(JSON.parse),
  readFile(reviewPath, 'utf8').then(JSON.parse),
  readFile(policyPath, 'utf8'),
]);
validateMission(mission);
const policy = parsePolicy(policySource);
const checkedOutSha = run('git', ['rev-parse', 'HEAD']);
const pr = JSON.parse(run('gh', ['pr', 'view', prNumber, '--json', 'headRefOid,url']));
await verifyPublicationTarget({ requestedSha: certificate.reviewed_sha, checkedOutSha, remotePrHeadSha: pr.headRefOid });
const changedPaths = deriveChangedPaths({ baseSha: certificate.base_sha, headSha: certificate.reviewed_sha });
validateCertificate(certificate, {
  mission,
  review,
  policy,
  headSha: certificate.reviewed_sha,
  baseSha: certificate.base_sha,
  uiChanges: uiChangesValue === 'true',
  changedPaths,
});
const repository = run('gh', ['repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner']);
run('gh', ['api', `repos/${repository}/statuses/${certificate.reviewed_sha}`, '--method', 'POST', '-f', 'state=success', '-f', 'context=valoir-shiploop', '-f', `description=Shiploop certificate ${certificate.certificate_hash.slice(0, 12)} validated`, '-f', `target_url=${pr.url}`]);
run('gh', ['pr', 'comment', prNumber, '--body', `Valoir Shiploop: APPROVE for exact SHA \`${certificate.reviewed_sha}\`. Certificate \`${certificate.certificate_hash}\` validated locally; runtime evidence remains outside Git.`]);
console.log(`Published valoir-shiploop success for ${certificate.reviewed_sha}`);
