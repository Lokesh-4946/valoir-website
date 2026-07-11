#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

function run(command, args) {
  return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
}

export function verifyLauncherState({ worktreeStatus, checkedOutSha, remoteHeadSha, reviewHeadSha, actualTreeSha, reviewedTreeSha }) {
  if (worktreeStatus !== '') throw new Error('publisher refuses a dirty tracked or untracked worktree');
  if (checkedOutSha !== remoteHeadSha || checkedOutSha !== reviewHeadSha) throw new Error('publisher launcher exact head mismatch');
  if (actualTreeSha !== reviewedTreeSha) throw new Error('publisher tree SHA does not match reviewed evidence');
  return checkedOutSha;
}

async function main() {
  const [prNumber, , , reviewPath] = process.argv.slice(2);
  if (!/^[1-9]\d*$/.test(prNumber ?? '')) throw new Error('PR number must be a canonical positive integer');
  const review = JSON.parse(await readFile(reviewPath, 'utf8'));
  if (review.publisher?.entry_path !== 'scripts/shiploop/publish-status.mjs') throw new Error('review does not bind the trusted launcher entry path');
  const repository = run('gh', ['repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner']);
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) throw new Error('repository must be canonical owner/name');
  const remote = JSON.parse(run('gh', ['pr', 'view', prNumber, '--repo', repository, '--json', 'headRefOid']));
  verifyLauncherState({
    worktreeStatus: run('git', ['status', '--porcelain', '--untracked-files=all']),
    checkedOutSha: run('git', ['rev-parse', 'HEAD']),
    remoteHeadSha: remote.headRefOid,
    reviewHeadSha: review.reviewed_sha,
    actualTreeSha: run('git', ['rev-parse', 'HEAD:scripts/shiploop']),
    reviewedTreeSha: review.publisher.publisher_tree_sha,
  });
  await import('./publish-status-core.mjs');
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
