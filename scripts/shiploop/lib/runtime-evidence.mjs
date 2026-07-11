import { realpath } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { certificateHash, changedPathsHash, normalizedHash } from './hash.mjs';
import { validateMission } from './mission.mjs';
import { validatePolicy } from './policy.mjs';
import { validateReview } from './review.mjs';
import { validateChangedPaths } from './scope.mjs';

function isInside(parent, candidate) {
  const child = relative(parent, candidate);
  return child === '' || (!isAbsolute(child) && child !== '..' && !child.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`));
}

async function effectivePath(path, mustExist) {
  if (mustExist) return realpath(path);
  let ancestor = path;
  while (true) {
    try {
      const resolvedAncestor = await realpath(ancestor);
      return resolve(resolvedAncestor, relative(ancestor, path));
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
      const parent = dirname(ancestor);
      if (parent === ancestor) throw error;
      ancestor = parent;
    }
  }
}

export async function requireExternalEvidencePath(outputPath, repositoryRoot = process.cwd(), { mustExist = false } = {}) {
  const absoluteOutput = resolve(outputPath);
  const [realRepository, effectiveOutput] = await Promise.all([realpath(resolve(repositoryRoot)), effectivePath(absoluteOutput, mustExist)]);
  if (isInside(realRepository, effectiveOutput)) {
    throw new Error('runtime evidence output must be outside the reviewed repository');
  }
  return absoluteOutput;
}

export function buildCertificate({ mission, policy, review, requiredChecks, preview, changedPaths, generatedAt = new Date().toISOString() }) {
  validateMission(mission);
  validatePolicy(policy);
  validateReview(review, {
    mission,
    policy,
    headSha: review.reviewed_sha,
    baseSha: review.base_sha,
    uiChanges: review.ui_changes,
  });
  validateChangedPaths(changedPaths, mission, review);
  const expiresAt = new Date(Date.parse(generatedAt) + policy.certificate_ttl_hours * 3_600_000).toISOString();
  const certificate = {
    schema_version: 1,
    reviewed_sha: review.reviewed_sha,
    base_sha: review.base_sha,
    mission_contract_id: mission.contract_id,
    mission_contract_hash: normalizedHash(mission),
    review_artifact_hash: normalizedHash(review),
    required_checks: requiredChecks,
    preview,
    adjudicator: review.adjudicator,
    generated_at: generatedAt,
    expires_at: expiresAt,
    changed_paths_hash: changedPathsHash(changedPaths),
  };
  certificate.certificate_hash = certificateHash({
    mission,
    review,
    requiredChecks,
    reviewedSha: review.reviewed_sha,
    changedPaths,
  });
  return certificate;
}
