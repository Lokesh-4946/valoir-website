import { fail, rejectUnknownFields, requireBoolean, requireIdentity, requireInteger, requireObject, requireSafePath, requireSchema, requireSha, requireString, requireStringArray, requireTimestamp } from './errors.mjs';
import { normalizedHash } from './hash.mjs';
import { validateScopeExceptions } from './scope.mjs';
import { rejectReservedCheckContexts } from './check-contexts.mjs';

const FIELDS = ['schema_version', 'reviewed_sha', 'base_sha', 'iteration', 'mission_contract_id', 'mission_contract_hash', 'implementation_owner', 'adjudicator', 'risk_level', 'ui_changes', 'security_sensitive', 'scope_exceptions', 'reviewers', 'intent_alignment', 'findings', 'resolved_findings', 'unresolved_comment_count', 'required_checks', 'rizz_evidence', 'verdict', 'generated_at', 'blockers', 'next_authorized_actor', 'escalation'];
const FINDING_FIELDS = ['id', 'priority', 'category', 'file', 'line_start', 'line_end', 'evidence', 'required_change', 'status', 'adjudication_rationale'];
const RIZZ_EVIDENCE_FIELDS = ['cli_version', 'true_positives', 'false_positives', 'missed_findings', 'useful_prompts', 'investigation_minutes_saved'];

function validateFinding(finding, path) {
  requireObject(finding, path);
  rejectUnknownFields(finding, FINDING_FIELDS, path);
  for (const field of ['id', 'priority', 'category', 'file', 'evidence', 'required_change', 'status', 'adjudication_rationale']) requireString(finding[field], `${path}.${field}`);
  requireSafePath(finding.file, `${path}.file`);
  if (!['P0', 'P1', 'P2', 'P3'].includes(finding.priority)) fail('invalid_priority', `${path}.priority`, 'must be P0, P1, P2, or P3');
  if (!['open', 'resolved', 'rejected'].includes(finding.status)) fail('invalid_status', `${path}.status`, 'must be open, resolved, or rejected');
  const startPresent = finding.line_start !== undefined;
  const endPresent = finding.line_end !== undefined;
  if (startPresent !== endPresent) fail('invalid_line_range', path, 'line_start and line_end must be supplied together');
  if (!startPresent) return;
  const bothNull = finding.line_start === null && finding.line_end === null;
  if (bothNull) return;
  if (finding.line_start === null || finding.line_end === null) fail('invalid_line_range', path, 'line_start and line_end must both be null or both be integers');
  requireInteger(finding.line_start, `${path}.line_start`);
  requireInteger(finding.line_end, `${path}.line_end`);
  if (finding.line_start < 1 || finding.line_end < 1 || finding.line_end < finding.line_start) fail('invalid_line_range', path, 'line range must contain positive ascending integers');
}

function validateRizzEvidence(evidence) {
  requireObject(evidence, '$.rizz_evidence');
  rejectUnknownFields(evidence, RIZZ_EVIDENCE_FIELDS, '$.rizz_evidence');
  requireString(evidence.cli_version, '$.rizz_evidence.cli_version');
  for (const field of ['true_positives', 'false_positives', 'missed_findings', 'investigation_minutes_saved']) {
    requireInteger(evidence[field], `$.rizz_evidence.${field}`);
    if (evidence[field] < 0) fail('invalid_rizz_evidence', `$.rizz_evidence.${field}`, 'must be non-negative');
  }
  requireStringArray(evidence.useful_prompts, '$.rizz_evidence.useful_prompts');
}

function validateBlockedEvidence(review) {
  if (!Array.isArray(review.blockers) || review.blockers.length === 0) fail('missing_blocker_evidence', '$.blockers', 'BLOCKED requires at least one structured blocker');
  review.blockers.forEach((blocker, index) => {
    const path = `$.blockers[${index}]`;
    requireObject(blocker, path);
    rejectUnknownFields(blocker, ['code', 'evidence'], path);
    requireString(blocker.code, `${path}.code`);
    requireString(blocker.evidence, `${path}.evidence`);
  });
  requireIdentity(review.next_authorized_actor, '$.next_authorized_actor');
  requireString(review.escalation, '$.escalation');
  if (review.escalation !== review.escalation.trim()) fail('invalid_type', '$.escalation', 'must not contain surrounding whitespace');
}

export function validateReview(review, context) {
  requireSchema(review);
  requireObject(context, '$.context');
  const { mission, policy, headSha, baseSha } = context;
  const uiChanges = context.uiChanges ?? review.ui_changes;
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
  if (Date.parse(mission.created_at) > Date.parse(review.generated_at)) fail('noncausal_timestamp', '$.generated_at', 'review cannot predate the mission');
  for (const field of ['implementation_owner', 'adjudicator']) requireIdentity(review[field], `$.${field}`);
  const implementationOwner = review.implementation_owner.toLowerCase();
  const adjudicator = review.adjudicator.toLowerCase();
  if (implementationOwner === adjudicator) fail('self_review', '$.adjudicator', 'implementation owner cannot adjudicate');
  if (!['low', 'medium', 'high'].includes(review.risk_level)) fail('invalid_risk_level', '$.risk_level', 'must be low, medium, or high');
  requireBoolean(review.ui_changes, '$.ui_changes');
  requireBoolean(review.security_sensitive, '$.security_sensitive');
  validateScopeExceptions(review.scope_exceptions);
  if (review.ui_changes !== uiChanges) fail('applicability_mismatch', '$.ui_changes', 'must match independently supplied UI applicability');
  if (!Array.isArray(review.reviewers)) fail('invalid_type', '$.reviewers', 'must be an array');
  const reviewerRoles = new Set();
  const reviewerIdentities = new Set();
  for (const [index, reviewer] of review.reviewers.entries()) {
    requireObject(reviewer, `$.reviewers[${index}]`);
    rejectUnknownFields(reviewer, ['id', 'role'], `$.reviewers[${index}]`);
    requireIdentity(reviewer.id, `$.reviewers[${index}].id`);
    requireString(reviewer.role, `$.reviewers[${index}].role`);
    const reviewerIdentity = reviewer.id.toLowerCase();
    if (reviewerIdentity === implementationOwner) fail('self_review', `$.reviewers[${index}].id`, 'implementation owner cannot review');
    if (reviewerIdentities.has(reviewerIdentity)) fail('duplicate_reviewer_identity', `$.reviewers[${index}].id`, 'schema v1 forbids one identity from filling multiple reviewer roles');
    reviewerIdentities.add(reviewerIdentity);
    reviewerRoles.add(reviewer.role);
  }
  if (review.verdict === 'APPROVE' && review.reviewers.length === 0) fail('missing_reviewer', '$.reviewers', 'approval requires reviewer evidence');
  const requiredRoles = new Set(policy.required_reviewers);
  if (uiChanges) requiredRoles.add('experience');
  const missingRoles = [...requiredRoles].filter((role) => !reviewerRoles.has(role));
  if (missingRoles.length > 0 && review.verdict !== 'BLOCKED') fail('missing_reviewer', '$.reviewers', `missing required reviewer role ${missingRoles[0]}`);
  if (!['pass', 'fail', 'uncertain'].includes(review.intent_alignment)) fail('invalid_intent_alignment', '$.intent_alignment', 'must be pass, fail, or uncertain');
  if (review.verdict === 'APPROVE' && review.intent_alignment !== 'pass') fail('intent_misalignment', '$.intent_alignment', 'must pass before approval');
  const findingIds = new Set();
  for (const field of ['findings', 'resolved_findings']) {
    if (!Array.isArray(review[field])) fail('invalid_type', `$.${field}`, 'must be an array');
    review[field].forEach((finding, index) => {
      validateFinding(finding, `$.${field}[${index}]`);
      const expectedStatuses = field === 'findings' ? ['open'] : ['resolved', 'rejected'];
      if (!expectedStatuses.includes(finding.status)) fail('finding_bucket_mismatch', `$.${field}[${index}].status`, `status is inconsistent with ${field}`);
      if (findingIds.has(finding.id)) fail('duplicate_finding_id', `$.${field}[${index}].id`, 'finding IDs must be globally unique');
      findingIds.add(finding.id);
    });
  }
  const blocking = review.findings.find((finding) => policy.blocking_priorities.includes(finding.priority) && finding.status === 'open');
  if (blocking && review.verdict === 'APPROVE') fail('blocking_finding', '$.findings', `${blocking.id} blocks approval`);
  requireInteger(review.unresolved_comment_count, '$.unresolved_comment_count');
  if (review.unresolved_comment_count < 0) fail('invalid_type', '$.unresolved_comment_count', 'must be non-negative');
  if (policy.require_zero_unresolved && review.unresolved_comment_count > 0 && review.verdict === 'APPROVE') fail('unresolved_comments', '$.unresolved_comment_count', 'approval requires zero unresolved comments');
  requireStringArray(review.required_checks, '$.required_checks');
  rejectReservedCheckContexts(review.required_checks);
  for (const check of mission.required_checks) if (!review.required_checks.includes(check)) fail('missing_required_check', '$.required_checks', `missing ${check}`);
  if (!['APPROVE', 'REQUEST_CHANGES', 'BLOCKED'].includes(review.verdict)) fail('invalid_verdict', '$.verdict', 'is not allowed');
  if (review.verdict === 'BLOCKED') validateBlockedEvidence(review);
  if (review.verdict !== 'BLOCKED' && [review.blockers, review.next_authorized_actor, review.escalation].some((value) => value !== undefined)) fail('unexpected_blocker_evidence', '$', 'blocker and escalation fields are only valid for BLOCKED');
  if (review.iteration === policy.max_iterations && review.verdict === 'REQUEST_CHANGES') fail('iteration_cap_requires_blocked', '$.verdict', 'the final unsuccessful iteration must be BLOCKED');
  requireTimestamp(review.generated_at, '$.generated_at');
  if (policy.profile === 'rizz-reviewloop') validateRizzEvidence(review.rizz_evidence);
  return review;
}
