import { rejectUnknownFields, requireSafePath, requireSchema, requireString, requireStringArray, requireTimestamp } from './errors.mjs';

const FIELDS = ['schema_version', 'contract_id', 'product', 'intent', 'approved_design', 'implementation_plan', 'expected_paths', 'forbidden_paths', 'acceptance_criteria', 'required_checks', 'created_at', 'approved_by'];

export function validateMission(mission) {
  requireSchema(mission);
  rejectUnknownFields(mission, FIELDS);
  for (const field of ['contract_id', 'product', 'intent', 'approved_design', 'implementation_plan', 'approved_by']) requireString(mission[field], `$.${field}`);
  for (const field of ['expected_paths', 'forbidden_paths', 'acceptance_criteria', 'required_checks']) requireStringArray(mission[field], `$.${field}`);
  for (const field of ['expected_paths', 'forbidden_paths']) mission[field].forEach((value, index) => requireSafePath(value, `$.${field}[${index}]`));
  requireTimestamp(mission.created_at, '$.created_at');
  return mission;
}
