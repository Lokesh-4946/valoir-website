import { fail, rejectUnknownFields, requireIdentity, requireObject, requireSafePath, requireSchema, requireString, requireStringArray, requireTimestamp } from './errors.mjs';
import { rejectReservedCheckContexts } from './check-contexts.mjs';

const FIELDS = ['schema_version', 'contract_id', 'product', 'intent', 'intent_mode', 'approved_design', 'implementation_plan', 'authorization_sources', 'related_contract_ids', 'expected_paths', 'forbidden_paths', 'acceptance_criteria', 'required_checks', 'trusted_checks', 'created_at', 'approved_by'];

function validateTrustedChecks(checks, requiredNames) {
  if (!Array.isArray(checks) || checks.length !== requiredNames.length) fail('invalid_trusted_check', '$.trusted_checks', 'must describe every required check exactly once');
  const seen = new Set();
  checks.forEach((check, index) => {
    const path = `$.trusted_checks[${index}]`;
    requireObject(check, path);
    requireString(check.name, `${path}.name`);
    requireString(check.source, `${path}.source`);
    if (seen.has(check.name) || !requiredNames.includes(check.name)) fail('invalid_trusted_check', `${path}.name`, 'must map uniquely to required_checks');
    seen.add(check.name);
    if (check.source === 'check_run') {
      rejectUnknownFields(check, ['name', 'source', 'app_slug', 'app_id', 'workflow_name', 'workflow_path'], path);
      requireString(check.app_slug, `${path}.app_slug`);
      if (!Number.isInteger(check.app_id)) fail('invalid_trusted_check', `${path}.app_id`, 'must be an integer GitHub App id');
      requireString(check.workflow_name, `${path}.workflow_name`);
      requireSafePath(check.workflow_path, `${path}.workflow_path`);
    } else if (check.source === 'status') {
      rejectUnknownFields(check, ['name', 'source', 'creator_login'], path);
      requireString(check.creator_login, `${path}.creator_login`);
    } else fail('invalid_trusted_check', `${path}.source`, 'must be check_run or status');
  });
}

export function validateMission(mission) {
  requireSchema(mission);
  rejectUnknownFields(mission, FIELDS);
  for (const field of ['contract_id', 'product', 'intent', 'approved_design', 'implementation_plan']) requireString(mission[field], `$.${field}`);
  if (!['standalone', 'composite'].includes(mission.intent_mode)) fail('invalid_intent_mode', '$.intent_mode', 'must be standalone or composite');
  requireIdentity(mission.approved_by, '$.approved_by');
  for (const field of ['authorization_sources', 'related_contract_ids', 'expected_paths', 'forbidden_paths', 'acceptance_criteria', 'required_checks']) requireStringArray(mission[field], `$.${field}`);
  const validAuthorization = mission.intent_mode === 'standalone'
    ? mission.authorization_sources.length >= 1 && mission.related_contract_ids.length === 0
    : mission.authorization_sources.length >= 2 && mission.related_contract_ids.length > 0;
  if (!validAuthorization) fail('invalid_authorization', '$.authorization_sources', 'authorization cardinality must match intent_mode');
  if (mission.required_checks.length === 0) fail('missing_required_check', '$.required_checks', 'CI baseline requires at least one check');
  rejectReservedCheckContexts(mission.required_checks);
  validateTrustedChecks(mission.trusted_checks, mission.required_checks);
  for (const field of ['expected_paths', 'forbidden_paths']) mission[field].forEach((value, index) => requireSafePath(value, `$.${field}[${index}]`));
  requireTimestamp(mission.created_at, '$.created_at');
  return mission;
}
