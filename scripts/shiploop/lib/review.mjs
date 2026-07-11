import { fail, rejectUnknownFields, requireInteger, requireObject, requireSafePath, requireSchema, requireSha, requireString, requireStringArray, requireTimestamp } from './errors.mjs';
import { normalizedHash } from './hash.mjs';

const FIELDS = ['schema_version', 'reviewed_sha', 'base_sha', 'iteration', 'mission_contract_id', 'mission_contract_hash', 'implementation_owner', 'adjudicator', 'reviewers', 'intent_alignment', 'findings', 'resolved_findings', 'unresolved_comment_count', 'required_checks', 'rizz_evidence', 'verdict', 'generated_at'];
const FINDING_FIELDS = ['id', 'priority', 'category', 'file', 'line_start', 'line_end', 'evidence', 'required_change', 'status', 'adjudication_rationale'];

function validateFinding(finding, path) {
  requireObject(finding, path);
  rejectUnknownFields(finding, FINDING_FIELDS, path);
  for (const field of ['id', 'priority', 'category', 'file', 'evidence', 'required_change', 'status', 'adjudication_rationale']) requireString(finding[field], `${path}.${field}`);
  requireSafePath(finding.file, `${path}.file`);
  if (!['P0', 'P1', 'P2', 'P3'].includes(finding.priority)) fail('invalid_priority', `${path}.priority`, 'must be P0, P1, P2, or P3');
  if (!['open', 'resolved', 'rejected'].includes(finding.status)) fail('invalid_status', `${path}.status`, 'must be open, resolved, or rejected');
  if (finding.line_start !== undefined) requireInteger(finding.line_start, `${path}.line_start`);
  if (finding.line_end !== undefined) requireInteger(finding.line_end, `${path}.line_end`);
  if (finding.line_start !== undefined && finding.line_end !== undefined && finding.line_end < finding.line_start) fail('invalid_line_range', path, 'line_end must not precede line_start');
}

export function validateReview(review, { mission, policy, headSha, baseSha }) {
  requireSchema(review);
  rejectUnknownFields(review, FIELDS);
  requireSha(review.reviewed_sha, '$.reviewed_sha');
  requireSha(review.base_sha, '$.base_sha');
  if (review.reviewed_sha !== headSha) fail('head_sha_mismatch', '$.reviewed_sha', 'must equal the PR head SHA');
  if (review.base_sha !== baseSha) fail('base_sha_mismatch', '$.base_sha', 'must equal the PR base SHA');
  requireInteger(review.iteration, '$.iteration');
  if (review.iteration < 1 || review.iteration > policy.max_iterations) fail('invalid_iteration', '$.iteration', `must be between 1 and ${policy.max_iterations}`);
  requireString(review.mission_contract_id, '$.mission_contract_id');
  if (review.mission_contract_id !== mission.contract_id) fail('mission_contract_mismatch', '$.mission_contract_id', 'must match the mission');
  if (review.mission_contract_hash !== normalizedHash(mission)) fail('mission_hash_mismatch', '$.mission_contract_hash', 'mission changed after review');
  for (const field of ['implementation_owner', 'adjudicator']) requireString(review[field], `$.${field}`);
  if (review.implementation_owner === review.adjudicator) fail('self_review', '$.adjudicator', 'implementation owner cannot adjudicate');
  if (!Array.isArray(review.reviewers)) fail('invalid_type', '$.reviewers', 'must be an array');
  const reviewerRoles = new Set();
  for (const [index, reviewer] of review.reviewers.entries()) {
    requireObject(reviewer, `$.reviewers[${index}]`);
    rejectUnknownFields(reviewer, ['id', 'role'], `$.reviewers[${index}]`);
    requireString(reviewer.id, `$.reviewers[${index}].id`);
    requireString(reviewer.role, `$.reviewers[${index}].role`);
    if (reviewer.id === review.implementation_owner) fail('self_review', `$.reviewers[${index}].id`, 'implementation owner cannot review');
    reviewerRoles.add(reviewer.role);
  }
  for (const role of policy.required_reviewers) if (!reviewerRoles.has(role)) fail('missing_reviewer', '$.reviewers', `missing required reviewer role ${role}`);
  if (review.intent_alignment !== 'pass') fail('intent_misalignment', '$.intent_alignment', 'must pass before approval');
  for (const field of ['findings', 'resolved_findings']) {
    if (!Array.isArray(review[field])) fail('invalid_type', `$.${field}`, 'must be an array');
    review[field].forEach((finding, index) => validateFinding(finding, `$.${field}[${index}]`));
  }
  const blocking = review.findings.find((finding) => policy.blocking_priorities.includes(finding.priority) && finding.status === 'open');
  if (blocking && review.verdict === 'APPROVE') fail('blocking_finding', '$.findings', `${blocking.id} blocks approval`);
  requireInteger(review.unresolved_comment_count, '$.unresolved_comment_count');
  if (review.unresolved_comment_count < 0) fail('invalid_type', '$.unresolved_comment_count', 'must be non-negative');
  if (policy.require_zero_unresolved && review.unresolved_comment_count > 0 && review.verdict === 'APPROVE') fail('unresolved_comments', '$.unresolved_comment_count', 'approval requires zero unresolved comments');
  requireStringArray(review.required_checks, '$.required_checks');
  for (const check of mission.required_checks) if (!review.required_checks.includes(check)) fail('missing_required_check', '$.required_checks', `missing ${check}`);
  if (review.required_checks.some((name) => ['valoir-shiploop', 'rizz-reviewloop'].includes(name))) fail('recursive_check', '$.required_checks', 'Shiploop cannot require itself');
  if (!['APPROVE', 'REQUEST_CHANGES', 'BLOCKED'].includes(review.verdict)) fail('invalid_verdict', '$.verdict', 'is not allowed');
  if (review.iteration === policy.max_iterations && review.verdict === 'REQUEST_CHANGES') fail('iteration_cap_requires_blocked', '$.verdict', 'the final unsuccessful iteration must be BLOCKED');
  requireTimestamp(review.generated_at, '$.generated_at');
  if (policy.profile === 'rizz-reviewloop') requireObject(review.rizz_evidence, '$.rizz_evidence');
  return review;
}
