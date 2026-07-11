export class ShiploopValidationError extends Error {
  constructor(errors) {
    super(errors.map(({ code, path, message }) => `${code} at ${path}: ${message}`).join('\n'));
    this.name = 'ShiploopValidationError';
    this.errors = errors;
  }
}

export function fail(code, path, message) {
  throw new ShiploopValidationError([{ code, path, message }]);
}

export function requireObject(value, path) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('invalid_type', path, 'must be an object');
}

export function requireSchema(value) {
  requireObject(value, '$');
  if (value.schema_version !== 1) fail('unsupported_schema_version', '$.schema_version', 'must equal 1');
}

export function requireString(value, path) {
  if (typeof value !== 'string' || value.trim() === '') fail('invalid_type', path, 'must be a non-empty string');
}

export function requireIdentity(value, path) {
  requireString(value, path);
  if (value !== value.trim()) fail('invalid_identity', path, 'must not contain surrounding whitespace');
}

export function requireStringArray(value, path) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.trim() === '')) fail('invalid_type', path, 'must be an array of non-empty strings');
}

export function requireInteger(value, path) {
  if (!Number.isInteger(value)) fail('invalid_type', path, 'must be an integer');
}

export function requireBoolean(value, path) {
  if (typeof value !== 'boolean') fail('invalid_type', path, 'must be a boolean');
}

export function requireSha(value, path) {
  if (typeof value !== 'string' || !/^[0-9a-f]{40}$/.test(value)) fail('invalid_sha', path, 'must be a lowercase 40-character Git SHA');
}

export function requireTimestamp(value, path) {
  requireString(value, path);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) || Number.isNaN(Date.parse(value))) fail('invalid_timestamp', path, 'must be an RFC3339 UTC timestamp');
  const canonicalInput = value.includes('.') ? value : value.replace('Z', '.000Z');
  if (new Date(value).toISOString() !== canonicalInput) fail('invalid_timestamp', path, 'must represent a real calendar date exactly');
}

export function rejectUnknownFields(value, allowed, path = '$') {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) fail('unknown_field', `${path}.${key}`, 'is not allowed');
  }
}

export function requireSafePath(value, path) {
  requireString(value, path);
  if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(value) || value.startsWith('/') || value.startsWith('\\') || /^[A-Za-z]:[\\/]/.test(value)) fail('unsafe_path', path, 'must be repository-relative and contain no URL or file scheme');
  if (value.split(/[\\/]/).includes('..')) fail('path_traversal', path, 'must not traverse outside the repository');
}
