import { fail, rejectUnknownFields, requireObject, requireSafePath, requireString } from './errors.mjs';

function matchesScope(path, scope) {
  return scope.endsWith('/') ? path.startsWith(scope) : path === scope;
}

export function validateChangedPaths(changes, mission, review) {
  if (!Array.isArray(changes)) fail('missing_changed_paths', '$.changedPaths', 'trusted Git-derived changes are required');
  const exceptions = validateScopeExceptions(review.scope_exceptions);
  for (const [index, change] of changes.entries()) {
    const path = `$.changedPaths[${index}]`;
    requireObject(change, path);
    rejectUnknownFields(change, ['status', 'path', 'oldPath', 'kind', 'oldKind'], path);
    if (!['A', 'M', 'D', 'R', 'C', 'T'].includes(change.status)) fail('invalid_change_status', `${path}.status`, 'is not a supported Git change status');
    for (const [field, kind] of [['kind', change.kind], ['oldKind', change.oldKind]]) {
      if (kind === undefined) continue;
      if (!['file', 'directory', 'symlink', 'gitlink', 'nonregular', 'missing'].includes(kind)) fail('invalid_type', `${path}.${field}`, 'is not a recognized Git object kind');
      if (kind === 'symlink') fail('symlink_change', `${path}.${field}`, 'changed symlinks are not accepted as scope proof');
      if (kind !== 'file') fail('unsupported_object_kind', `${path}.${field}`, `schema v1 rejects ${kind} changes`);
    }
    const actualPaths = change.oldPath ? [change.oldPath, change.path] : [change.path];
    if (change.status === 'R' && !change.oldPath) fail('invalid_change_status', path, 'renames require oldPath');
    for (const actualPath of actualPaths) {
      requireSafePath(actualPath, `${path}.path`);
      if (mission.forbidden_paths.some((scope) => matchesScope(actualPath, scope))) fail('forbidden_path', `${path}.path`, `${actualPath} is forbidden`);
      const expected = mission.expected_paths.some((scope) => matchesScope(actualPath, scope));
      if (!expected && !exceptions.has(actualPath)) fail('scope_violation', `${path}.path`, `${actualPath} is outside approved scope without an exact adjudicated exception`);
    }
  }
  return changes;
}

export function validateScopeExceptions(scopeExceptions) {
  if (!Array.isArray(scopeExceptions)) fail('invalid_type', '$.scope_exceptions', 'must be an array');
  const exceptions = new Set();
  scopeExceptions.forEach((exception, index) => {
    const path = `$.scope_exceptions[${index}]`;
    requireObject(exception, path);
    rejectUnknownFields(exception, ['path', 'evidence', 'adjudication_rationale'], path);
    requireSafePath(exception.path, `${path}.path`);
    requireString(exception.evidence, `${path}.evidence`);
    requireString(exception.adjudication_rationale, `${path}.adjudication_rationale`);
    exceptions.add(exception.path);
  });
  return exceptions;
}
