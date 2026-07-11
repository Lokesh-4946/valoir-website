import { createHash } from 'node:crypto';

function normalized(value) {
  if (Array.isArray(value)) return value.map(normalized);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, normalized(value[key])]));
  }
  return value;
}

export function normalizedHash(value) {
  return createHash('sha256').update(JSON.stringify(normalized(value))).digest('hex');
}

export function certificateHash({ mission, review, requiredChecks, reviewedSha }) {
  return normalizedHash({ mission, review, required_checks: requiredChecks, reviewed_sha: reviewedSha });
}
