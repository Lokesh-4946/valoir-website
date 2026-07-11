#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { validateCertificate } from './lib/certificate.mjs';
import { deriveChangedPaths } from './lib/git-changes.mjs';
import { validateMission } from './lib/mission.mjs';
import { parsePolicy } from './lib/policy.mjs';
import { validateLiveEvidence, validatePrNumber, validateRepository, verifyPublicationTarget } from './lib/publication.mjs';
import { requireExternalEvidencePath } from './lib/runtime-evidence.mjs';

function run(command, args) {
  return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
}

const [prNumberValue, certificatePath, missionPath, reviewPath, policyPath, uiChangesValue] = process.argv.slice(2);
const prNumber = validatePrNumber(prNumberValue);
if (![prNumber, certificatePath, missionPath, reviewPath, policyPath, uiChangesValue].every(Boolean)) {
  throw new Error('usage: publish-status.mjs <pr-number> <certificate.json> <mission.json> <review.json> <policy.yml> <ui-changes:true|false>');
}
if (!['true', 'false'].includes(uiChangesValue)) throw new Error('ui-changes must be true or false');
await requireExternalEvidencePath(certificatePath, process.cwd(), { mustExist: true });
await requireExternalEvidencePath(reviewPath, process.cwd(), { mustExist: true });
const [certificate, mission, review, policySource] = await Promise.all([
  readFile(certificatePath, 'utf8').then(JSON.parse),
  readFile(missionPath, 'utf8').then(JSON.parse),
  readFile(reviewPath, 'utf8').then(JSON.parse),
  readFile(policyPath, 'utf8'),
]);
validateMission(mission);
const policy = parsePolicy(policySource);
const publisherSource = await readFile(review.publisher.path);
const publisherHash = createHash('sha256').update(publisherSource).digest('hex');
if (review.publisher.path !== 'scripts/shiploop/publish-status.mjs' || review.publisher.sha256 !== publisherHash) throw new Error('review does not bind this exact success publisher');
const checkedOutSha = run('git', ['rev-parse', 'HEAD']);
const repository = validateRepository(run('gh', ['repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner']));
const pr = JSON.parse(run('gh', ['pr', 'view', prNumber, '--repo', repository, '--json', 'baseRefOid,headRefOid,url']));
let baseIsAncestor = true;
try {
  execFileSync('git', ['merge-base', '--is-ancestor', certificate.base_sha, certificate.reviewed_sha], { stdio: 'ignore' });
} catch {
  baseIsAncestor = false;
}
await verifyPublicationTarget({
  requestedSha: certificate.reviewed_sha,
  checkedOutSha,
  remotePrHeadSha: pr.headRefOid,
  requestedBaseSha: certificate.base_sha,
  remotePrBaseSha: pr.baseRefOid,
  baseIsAncestor,
});
const changedPaths = deriveChangedPaths({ baseSha: certificate.base_sha, headSha: certificate.reviewed_sha });
const checkRuns = JSON.parse(run('gh', ['api', `repos/${repository}/commits/${certificate.reviewed_sha}/check-runs`, '--paginate', '--slurp', '--jq', 'map(.check_runs) | add']));
for (const checkRun of checkRuns) {
  const runId = checkRun.details_url?.match(/\/actions\/runs\/(\d+)/)?.[1];
  if (checkRun.app?.slug === 'github-actions' && runId) {
    const workflowRun = JSON.parse(run('gh', ['api', `repos/${repository}/actions/runs/${runId}`]));
    checkRun.workflow = { name: workflowRun.name, path: workflowRun.path };
  }
}
const statuses = JSON.parse(run('gh', ['api', `repos/${repository}/commits/${certificate.reviewed_sha}/statuses`, '--paginate', '--slurp', '--jq', 'add']));
const workflowBlobs = {};
for (const trusted of mission.trusted_checks.filter(({ source }) => source === 'check_run')) {
  workflowBlobs[trusted.workflow_path] = {
    base: run('git', ['rev-parse', `${certificate.base_sha}:${trusted.workflow_path}`]),
    head: run('git', ['rev-parse', `${certificate.reviewed_sha}:${trusted.workflow_path}`]),
    local: run('git', ['hash-object', trusted.workflow_path]),
  };
}
const liveEvidence = validateLiveEvidence({
  requiredNames: mission.required_checks,
  reviewedSha: certificate.reviewed_sha,
  checkRuns,
  statuses,
  previewName: 'Vercel',
  trustedChecks: mission.trusted_checks,
  workflowBlobs,
});
if (JSON.stringify(certificate.required_checks) !== JSON.stringify(liveEvidence.requiredChecks)) throw new Error('certificate required checks do not match live GitHub evidence');
if (JSON.stringify(certificate.preview) !== JSON.stringify(liveEvidence.preview)) throw new Error('certificate preview does not match live GitHub evidence');
validateCertificate(certificate, {
  mission,
  review,
  policy,
  headSha: certificate.reviewed_sha,
  baseSha: certificate.base_sha,
  uiChanges: uiChangesValue === 'true',
  changedPaths,
});
run('gh', ['api', `repos/${repository}/statuses/${certificate.reviewed_sha}`, '--method', 'POST', '-f', 'state=success', '-f', 'context=valoir-shiploop', '-f', `description=Shiploop certificate ${certificate.certificate_hash.slice(0, 12)} validated`, '-f', `target_url=${pr.url}`]);
run('gh', ['pr', 'comment', prNumber, '--repo', repository, '--body', `Valoir Shiploop: APPROVE for exact SHA \`${certificate.reviewed_sha}\`. Certificate \`${certificate.certificate_hash}\` validated locally against live GitHub check evidence; runtime evidence remains outside Git.`]);
console.log(`Published valoir-shiploop success for ${certificate.reviewed_sha}`);
