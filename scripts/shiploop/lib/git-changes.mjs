import { execFileSync } from 'node:child_process';
import { fail, requireSha } from './errors.mjs';

export function parseNameStatus(output) {
  if (typeof output !== 'string' || !output.endsWith('\0')) fail('invalid_git_diff', '$.gitDiff', 'must be NUL-terminated');
  const tokens = output.split('\0');
  tokens.pop();
  const changes = [];
  for (let index = 0; index < tokens.length;) {
    let statusToken = tokens[index++];
    let embeddedPath;
    if (statusToken.includes('\t')) [statusToken, embeddedPath] = statusToken.split('\t', 2);
    const status = statusToken[0];
    const firstPath = embeddedPath ?? tokens[index++];
    if (!firstPath || !['A', 'M', 'D', 'R', 'C', 'T'].includes(status)) fail('invalid_git_diff', '$.gitDiff', 'contains a truncated or unsupported record');
    if (status === 'R' || status === 'C') {
      const newPath = tokens[index++];
      if (!newPath) fail('invalid_git_diff', '$.gitDiff', 'rename/copy record is truncated');
      changes.push({ status, oldPath: firstPath, path: newPath });
    } else changes.push({ status, path: firstPath });
  }
  return changes;
}

function git(args, cwd) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trimEnd();
  } catch {
    fail('invalid_git_sha', '$.git', `git ${args[0]} could not verify requested commit`);
  }
}

function kindAt(sha, path, cwd) {
  const record = git(['ls-tree', '-z', sha, '--', path], cwd);
  if (!record) return 'missing';
  const mode = record.split(' ', 1)[0];
  if (mode === '120000') return 'symlink';
  if (mode === '160000') return 'gitlink';
  if (mode === '040000') return 'directory';
  if (mode.startsWith('100')) return 'file';
  return 'nonregular';
}

export function deriveChangedPaths({ baseSha, headSha, cwd = process.cwd() }) {
  requireSha(baseSha, '$.baseSha');
  requireSha(headSha, '$.headSha');
  git(['cat-file', '-e', `${baseSha}^{commit}`], cwd);
  git(['cat-file', '-e', `${headSha}^{commit}`], cwd);
  if (git(['rev-parse', 'HEAD'], cwd) !== headSha) fail('stale_head_sha', '$.headSha', 'must equal the exact checked-out HEAD');
  const changes = parseNameStatus(execFileSync('git', ['diff', '--name-status', '-z', baseSha, headSha], { cwd, encoding: 'utf8' }));
  return changes.map((change) => {
    const treeSha = change.status === 'D' ? baseSha : headSha;
    const enriched = { ...change, kind: kindAt(treeSha, change.path, cwd) };
    if (['T', 'R', 'C'].includes(change.status)) enriched.oldKind = kindAt(baseSha, change.oldPath ?? change.path, cwd);
    return enriched;
  });
}
