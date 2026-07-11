import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { bindReviewPublisher } from '../../scripts/shiploop/lib/review-publisher.mjs';

test('review publisher binder rejects local, aliased, missing, and existing evidence paths', async () => {
  const root = await mkdtemp(join(tmpdir(), 'shiploop-review-binder-'));
  const repo = join(root, 'repo');
  const external = join(root, 'evidence');
  const alias = join(root, 'repo-alias');
  try {
    await mkdir(join(repo, 'scripts', 'shiploop'), { recursive: true });
    await mkdir(external);
    execFileSync('git', ['init', '-q'], { cwd: repo });
    await writeFile(join(repo, 'scripts', 'shiploop', 'entry.mjs'), 'export {}\n');
    execFileSync('git', ['add', '.'], { cwd: repo });
    execFileSync('git', ['-c', 'user.name=Shiploop', '-c', 'user.email=shiploop@example.invalid', 'commit', '-qm', 'base'], { cwd: repo });
    const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim();
    const draft = JSON.stringify({ reviewed_sha: head });
    await writeFile(join(repo, 'draft.json'), draft);
    await writeFile(join(external, 'draft.json'), draft);
    await writeFile(join(external, 'existing.json'), '{}');
    await symlink(repo, alias);

    await assert.rejects(bindReviewPublisher({ inputPath: join(repo, 'draft.json'), outputPath: join(external, 'out-a.json'), repositoryRoot: repo }), /outside the reviewed repository/);
    await assert.rejects(bindReviewPublisher({ inputPath: join(alias, 'draft.json'), outputPath: join(external, 'out-b.json'), repositoryRoot: repo }), /outside the reviewed repository/);
    await assert.rejects(bindReviewPublisher({ inputPath: join(external, 'draft.json'), outputPath: join(repo, 'out.json'), repositoryRoot: repo }), /outside the reviewed repository/);
    await assert.rejects(bindReviewPublisher({ inputPath: join(external, 'draft.json'), outputPath: join(alias, 'out.json'), repositoryRoot: repo }), /outside the reviewed repository/);
    await assert.rejects(bindReviewPublisher({ inputPath: join(external, 'missing.json'), outputPath: join(external, 'out-c.json'), repositoryRoot: repo }), /ENOENT/);
    await assert.rejects(bindReviewPublisher({ inputPath: join(external, 'draft.json'), outputPath: join(external, 'existing.json'), repositoryRoot: repo }), /EEXIST/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
