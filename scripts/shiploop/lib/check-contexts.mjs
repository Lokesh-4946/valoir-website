import { fail } from './errors.mjs';

const RESERVED_CONTEXTS = new Set(['valoir-shiploop', 'rizz-reviewloop']);

export function normalizeCheckContext(value) {
  return typeof value === 'string' ? value.toLowerCase() : value;
}

export function isReservedCheckContext(value) {
  return RESERVED_CONTEXTS.has(normalizeCheckContext(value));
}

export function rejectReservedCheckContexts(names, path = '$.required_checks') {
  for (const [index, name] of names.entries()) {
    if (isReservedCheckContext(name)) fail('recursive_check', `${path}[${index}]`, 'Shiploop cannot require itself');
  }
}
