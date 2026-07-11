import { fail, rejectUnknownFields, requireBoolean, requireInteger, requireSchema, requireString, requireStringArray } from './errors.mjs';

const FIELDS = ['schema_version', 'profile', 'max_iterations', 'required_reviewers', 'blocking_priorities', 'require_zero_unresolved', 'require_exact_head_sha', 'require_ci_green', 'require_preview_when_ui_changes', 'certificate_ttl_hours'];
const REQUIRED_TRUE = ['require_zero_unresolved', 'require_exact_head_sha', 'require_ci_green'];

function scalar(source) {
  if (source === 'true') return true;
  if (source === 'false') return false;
  if (/^-?\d+$/.test(source)) return Number(source);
  if (/^\[[^\]]*\]$/.test(source)) return source.slice(1, -1).split(',').map((item) => item.trim()).filter(Boolean);
  if (/^[A-Za-z0-9_.+/-]+$/.test(source)) return source;
  fail('invalid_yaml', '$', 'contains unsupported YAML syntax');
}

export function parsePolicy(source) {
  if (typeof source !== 'string') fail('invalid_yaml', '$', 'policy must be text');
  if (/[!&*{}]|[|>]/.test(source)) fail('invalid_yaml', '$', 'tags, anchors, aliases, flow maps, and block scalars are forbidden');
  const result = {};
  let listKey;
  for (const [index, rawLine] of source.split(/\r?\n/).entries()) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith('#')) continue;
    const listMatch = rawLine.match(/^  - ([A-Za-z0-9_.+/-]+)$/);
    if (listMatch && listKey) {
      result[listKey].push(listMatch[1]);
      continue;
    }
    const match = rawLine.match(/^([a-z_]+):(?: (.*))?$/);
    if (!match) fail('invalid_yaml', `$:${index + 1}`, 'contains unsupported YAML syntax');
    const [, key, rawValue] = match;
    if (!FIELDS.includes(key)) fail('unknown_field', `$.${key}`, 'is not allowed');
    if (Object.hasOwn(result, key)) fail('invalid_yaml', `$.${key}`, 'is duplicated');
    if (rawValue === undefined) {
      result[key] = [];
      listKey = key;
    } else {
      result[key] = scalar(rawValue.trim());
      listKey = undefined;
    }
  }
  return validatePolicy(result);
}

export function validatePolicy(policy) {
  requireSchema(policy);
  rejectUnknownFields(policy, FIELDS);
  requireString(policy.profile, '$.profile');
  if (!['valoir-shiploop', 'rizz-reviewloop'].includes(policy.profile)) fail('invalid_profile', '$.profile', 'must be valoir-shiploop or rizz-reviewloop');
  requireInteger(policy.max_iterations, '$.max_iterations');
  if (policy.max_iterations !== 5) fail('weakened_policy', '$.max_iterations', 'company maximum must equal 5');
  requireStringArray(policy.required_reviewers, '$.required_reviewers');
  if (policy.required_reviewers.length === 0) fail('invalid_type', '$.required_reviewers', 'must contain at least one reviewer role');
  requireStringArray(policy.blocking_priorities, '$.blocking_priorities');
  for (const priority of ['P0', 'P1', 'P2']) if (!policy.blocking_priorities.includes(priority)) fail('weakened_policy', '$.blocking_priorities', `must include ${priority}`);
  for (const field of [...REQUIRED_TRUE, 'require_preview_when_ui_changes']) requireBoolean(policy[field], `$.${field}`);
  for (const field of REQUIRED_TRUE) if (!policy[field]) fail('weakened_policy', `$.${field}`, 'company requirement cannot be disabled');
  requireInteger(policy.certificate_ttl_hours, '$.certificate_ttl_hours');
  if (policy.certificate_ttl_hours <= 0 || policy.certificate_ttl_hours > 24) fail('weakened_policy', '$.certificate_ttl_hours', 'must be between 1 and 24 hours');
  return policy;
}
