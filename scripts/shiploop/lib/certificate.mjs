import { fail, isValidTimestamp, rejectUnknownFields, requireBoolean, requireIdentity, requireObject, requireSchema, requireSha, requireString, requireTimestamp } from './errors.mjs';
import { certificateHash, changedPathsHash, normalizedHash } from './hash.mjs';
import { validateMission } from './mission.mjs';
import { validatePolicy } from './policy.mjs';
import { validateReview } from './review.mjs';
import { validateChangedPaths } from './scope.mjs';

const FIELDS = ['schema_version', 'reviewed_sha', 'base_sha', 'mission_contract_id', 'mission_contract_hash', 'review_artifact_hash', 'required_checks', 'preview', 'adjudicator', 'generated_at', 'expires_at', 'changed_paths_hash', 'certificate_hash'];

export function validateCertificate(certificate, context) {
  requireSchema(certificate);
  requireObject(context, '$.context');
  const { mission, review, policy, headSha, baseSha, uiChanges, changedPaths } = context;
  const now = context.now ?? new Date().toISOString();
  validateMission(mission);
  validatePolicy(policy);
  validateReview(review, { mission, policy, headSha, baseSha, uiChanges });
  validateChangedPaths(changedPaths, mission, review);
  rejectUnknownFields(certificate, FIELDS);
  requireSha(certificate.reviewed_sha, '$.reviewed_sha');
  requireSha(certificate.base_sha, '$.base_sha');
  if (certificate.reviewed_sha !== headSha || certificate.reviewed_sha !== review.reviewed_sha) fail('head_sha_mismatch', '$.reviewed_sha', 'certificate must bind the exact reviewed PR head');
  if (certificate.base_sha !== baseSha || certificate.base_sha !== review.base_sha) fail('base_sha_mismatch', '$.base_sha', 'certificate must bind the exact PR base');
  if (review.verdict !== 'APPROVE') fail('review_not_approved', '$.review.verdict', 'certificate requires APPROVE');
  if (certificate.mission_contract_id !== mission.contract_id) fail('mission_contract_mismatch', '$.mission_contract_id', 'must match mission');
  if (certificate.mission_contract_hash !== normalizedHash(mission)) fail('mission_hash_mismatch', '$.mission_contract_hash', 'mission was modified');
  if (certificate.review_artifact_hash !== normalizedHash(review)) fail('review_hash_mismatch', '$.review_artifact_hash', 'review was modified');
  if (certificate.changed_paths_hash !== changedPathsHash(changedPaths)) fail('changed_paths_hash_mismatch', '$.changed_paths_hash', 'does not match the trusted Git-derived changed-path set');
  requireIdentity(certificate.adjudicator, '$.adjudicator');
  if (certificate.adjudicator.toLowerCase() !== review.adjudicator.toLowerCase()) fail('adjudicator_mismatch', '$.adjudicator', 'must match independent adjudicator');
  if (!Array.isArray(certificate.required_checks)) fail('invalid_type', '$.required_checks', 'must be an array');
  const checkNames = new Set();
  for (const [index, check] of certificate.required_checks.entries()) {
    requireObject(check, `$.required_checks[${index}]`);
    rejectUnknownFields(check, ['name', 'conclusion', 'sha'], `$.required_checks[${index}]`);
    requireString(check.name, `$.required_checks[${index}].name`);
    if (['valoir-shiploop', 'rizz-reviewloop'].includes(check.name)) fail('recursive_check', `$.required_checks[${index}].name`, 'Shiploop cannot require itself');
    if (check.conclusion !== 'success') fail('failed_required_check', `$.required_checks[${index}].conclusion`, `${check.name} did not succeed`);
    if (check.sha !== headSha) fail('check_sha_mismatch', `$.required_checks[${index}].sha`, `${check.name} is stale`);
    checkNames.add(check.name);
  }
  for (const name of review.required_checks) if (!checkNames.has(name)) fail('missing_required_check', '$.required_checks', `missing ${name}`);
  requireObject(certificate.preview, '$.preview');
  rejectUnknownFields(certificate.preview, ['required', 'conclusion', 'sha'], '$.preview');
  requireBoolean(certificate.preview.required, '$.preview.required');
  if (!['success', 'failure', 'skipped', 'not_required'].includes(certificate.preview.conclusion)) fail('invalid_preview_conclusion', '$.preview.conclusion', 'must be success, failure, skipped, or not_required');
  const previewRequired = policy.require_preview_when_ui_changes && uiChanges !== false;
  if (previewRequired && !certificate.preview.required) fail('preview_required', '$.preview.required', 'policy and change applicability require preview evidence');
  if (certificate.preview.sha !== headSha) fail('preview_sha_mismatch', '$.preview.sha', 'preview is stale');
  if (certificate.preview.required && certificate.preview.conclusion !== 'success') fail('preview_failed', '$.preview.conclusion', 'required preview must succeed');
  if (!certificate.preview.required && !['skipped', 'not_required'].includes(certificate.preview.conclusion)) fail('preview_state_mismatch', '$.preview.conclusion', 'non-required preview must be skipped or not_required');
  requireTimestamp(certificate.generated_at, '$.generated_at');
  requireTimestamp(certificate.expires_at, '$.expires_at');
  const generated = Date.parse(certificate.generated_at);
  const expires = Date.parse(certificate.expires_at);
  if (!isValidTimestamp(now)) fail('invalid_now', '$.now', 'must be a real canonical RFC3339 UTC timestamp');
  const current = Date.parse(now);
  if (Date.parse(review.generated_at) > generated || generated > current) fail('noncausal_timestamp', '$.generated_at', 'must satisfy review <= certificate <= now');
  if (current >= expires) fail('certificate_expired', '$.expires_at', 'certificate has expired');
  if (expires <= generated || expires - generated > policy.certificate_ttl_hours * 3_600_000) fail('certificate_ttl_exceeded', '$.expires_at', 'exceeds policy TTL');
  const expectedHash = certificateHash({ mission, review, requiredChecks: certificate.required_checks, reviewedSha: certificate.reviewed_sha, changedPaths });
  if (certificate.certificate_hash !== expectedHash) fail('forged_certificate_hash', '$.certificate_hash', 'does not match normalized evidence');
  return certificate;
}
