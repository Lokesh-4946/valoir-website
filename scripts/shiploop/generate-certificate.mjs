#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { parsePolicy } from './lib/policy.mjs';
import { deriveChangedPaths } from './lib/git-changes.mjs';
import { buildCertificate, requireExternalEvidencePath } from './lib/runtime-evidence.mjs';

const [missionPath, policyPath, reviewPath, checksPath, previewPath, outputPath, repositoryRoot = process.cwd(), generatedAt] = process.argv.slice(2);
if (![missionPath, policyPath, reviewPath, checksPath, previewPath, outputPath].every(Boolean)) {
  throw new Error('usage: generate-certificate.mjs <mission.json> <policy.yml> <review.json> <checks.json> <preview.json> <external-output.json> [repository-root] [generated-at]');
}
const [mission, policySource, review, requiredChecks, preview] = await Promise.all([
  readFile(missionPath, 'utf8').then(JSON.parse),
  readFile(policyPath, 'utf8'),
  readFile(reviewPath, 'utf8').then(JSON.parse),
  readFile(checksPath, 'utf8').then(JSON.parse),
  readFile(previewPath, 'utf8').then(JSON.parse),
]);
const policy = parsePolicy(policySource);
const changedPaths = deriveChangedPaths({ baseSha: review.base_sha, headSha: review.reviewed_sha, cwd: repositoryRoot });
const certificate = buildCertificate({ mission, policy, review, requiredChecks, preview, changedPaths, generatedAt });
const safeOutput = await requireExternalEvidencePath(outputPath, repositoryRoot);
await mkdir(dirname(safeOutput), { recursive: true });
await writeFile(safeOutput, `${JSON.stringify(certificate, null, 2)}\n`, { flag: 'wx' });
console.log(safeOutput);
