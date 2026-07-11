import { fail } from './errors.mjs';

function requireRecords(records, code, path) {
  if (!Array.isArray(records) || records.length === 0 || records.some((record) => !record || typeof record !== 'object' || Array.isArray(record))) {
    fail(code, path, 'must contain at least one structured GitHub evidence record');
  }
  return records;
}

export function flattenCheckRunPages(value) {
  const pages = Array.isArray(value) ? value : [value];
  if (pages.length === 0 || pages.some((page) => !page || typeof page !== 'object' || Array.isArray(page) || !Array.isArray(page.check_runs))) {
    fail('github_check_pages', '$.checkRunPages', 'must be a check-runs page object or array of page objects');
  }
  return requireRecords(pages.flatMap((page) => page.check_runs), 'github_check_pages', '$.checkRunPages');
}

export function flattenStatusPages(value, requestedSha) {
  if (typeof requestedSha !== 'string' || !/^[0-9a-f]{40}$/.test(requestedSha)) fail('github_status_sha', '$.requestedSha', 'must be the independently requested exact commit SHA');
  if (!Array.isArray(value) || value.length === 0) fail('github_status_pages', '$.statusPages', 'must be a status array or array of status pages');
  const records = Array.isArray(value[0]) ? value.flat() : value;
  return requireRecords(records, 'github_status_pages', '$.statusPages').map((record, index) => {
    if (record.sha !== undefined && (typeof record.sha !== 'string' || !/^[0-9a-f]{40}$/.test(record.sha) || record.sha !== requestedSha)) {
      fail('github_status_sha', `$.statusPages[${index}].sha`, 'present status SHA must equal the independently requested exact SHA');
    }
    return { ...record, sha: requestedSha };
  });
}
