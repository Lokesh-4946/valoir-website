import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { buildCertificate, requireExternalEvidencePath } from '../../scripts/shiploop/lib/runtime-evidence.mjs';
import { validateLiveEvidence, validatePrNumber, verifyPublicationTarget } from '../../scripts/shiploop/lib/publication.mjs';
import { BASE_SHA, HEAD_SHA, NOW, WEBSITE_CHANGES, websiteFixture } from './fixtures.mjs';

test('runtime certificate generation produces evidence that validates unchanged exact SHA', () => {
  const fixture = websiteFixture();
  const certificate = buildCertificate({
    mission: fixture.mission,
    policy: fixture.policy,
    review: fixture.review,
    requiredChecks: fixture.certificate.required_checks,
    preview: fixture.certificate.preview,
    changedPaths: WEBSITE_CHANGES,
    generatedAt: fixture.certificate.generated_at,
  });
  assert.deepEqual(certificate, fixture.certificate);
});

test('runtime evidence output must be outside the reviewed repository', async () => {
  const repo = await mkdtemp(join(tmpdir(), 'shiploop-repo-'));
  try {
    await assert.rejects(requireExternalEvidencePath(join(repo, 'review.json'), repo), /outside the reviewed repository/);
    assert.equal(await requireExternalEvidencePath(join(tmpdir(), 'shiploop-evidence', 'review.json'), repo), join(tmpdir(), 'shiploop-evidence', 'review.json'));
  } finally {
    await rm(repo, { recursive: true, force: true });
  }
});

test('runtime evidence rejects an outside symlink alias that resolves into the repository', async () => {
  const root = await mkdtemp(join(tmpdir(), 'shiploop-boundary-'));
  const repo = join(root, 'repo');
  const alias = join(root, 'alias');
  try {
    await mkdir(repo);
    await symlink(repo, alias);
    await assert.rejects(requireExternalEvidencePath(join(alias, 'review.json'), repo), /outside the reviewed repository/);
    await writeFile(join(repo, 'existing.json'), '{}');
    await assert.rejects(requireExternalEvidencePath(join(alias, 'existing.json'), repo, { mustExist: true }), /outside the reviewed repository/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('publisher refuses checked-out SHA that differs from requested or remote PR head', async () => {
  await assert.rejects(
    verifyPublicationTarget({ requestedSha: HEAD_SHA, checkedOutSha: BASE_SHA, remotePrHeadSha: HEAD_SHA, requestedBaseSha: BASE_SHA, remotePrBaseSha: BASE_SHA, baseIsAncestor: true }),
    /checked-out HEAD/,
  );
  await assert.rejects(
    verifyPublicationTarget({ requestedSha: HEAD_SHA, checkedOutSha: HEAD_SHA, remotePrHeadSha: BASE_SHA, requestedBaseSha: BASE_SHA, remotePrBaseSha: BASE_SHA, baseIsAncestor: true }),
    /remote PR head/,
  );
});

test('publisher rejects remote base mismatch and a base that is not an ancestor', async () => {
  await assert.rejects(
    verifyPublicationTarget({ requestedSha: HEAD_SHA, checkedOutSha: HEAD_SHA, remotePrHeadSha: HEAD_SHA, requestedBaseSha: BASE_SHA, remotePrBaseSha: 'c'.repeat(40), baseIsAncestor: true }),
    /remote PR base/,
  );
  await assert.rejects(
    verifyPublicationTarget({ requestedSha: HEAD_SHA, checkedOutSha: HEAD_SHA, remotePrHeadSha: HEAD_SHA, requestedBaseSha: BASE_SHA, remotePrBaseSha: BASE_SHA, baseIsAncestor: false }),
    /ancestor/,
  );
});

test('publisher accepts only one exact SHA across certificate, checkout, and remote PR', async () => {
  assert.equal(
    await verifyPublicationTarget({ requestedSha: HEAD_SHA, checkedOutSha: HEAD_SHA, remotePrHeadSha: HEAD_SHA, requestedBaseSha: BASE_SHA, remotePrBaseSha: BASE_SHA, baseIsAncestor: true }),
    HEAD_SHA,
  );
});

test('PR numbers are canonical positive integers before reaching gh', () => {
  assert.equal(validatePrNumber('14'), '14');
  for (const value of ['0', '-1', '01', '1.5', '--repo', 'abc']) assert.throws(() => validatePrNumber(value), /positive integer/);
});

test('live GitHub evidence replaces untrusted check conclusions and excludes Shiploop recursively', () => {
  const fixture = websiteFixture();
  const live = validateLiveEvidence({
    requiredNames: fixture.mission.required_checks,
    reviewedSha: HEAD_SHA,
    checkRuns: [
      { name: 'build + typecheck', conclusion: 'success', head_sha: HEAD_SHA, app: { slug: 'github-actions', id: 15368 }, workflow: { name: 'CI', path: '.github/workflows/ci.yml' } },
      { name: 'Valoir-Shiploop', conclusion: 'success', head_sha: HEAD_SHA },
    ],
    statuses: [
      { context: 'Vercel', state: 'success', sha: HEAD_SHA, creator: { login: 'vercel[bot]' } },
      { context: 'VALOIR-SHIPLOOP', state: 'success', sha: HEAD_SHA },
    ],
    previewName: 'Vercel',
    trustedChecks: fixture.mission.trusted_checks,
    workflowBlobs: { '.github/workflows/ci.yml': { base: 'd'.repeat(40), head: 'd'.repeat(40), local: 'd'.repeat(40) } },
  });
  assert.deepEqual(live.requiredChecks, fixture.certificate.required_checks);
  assert.deepEqual(live.preview, fixture.certificate.preview);
});

test('live GitHub evidence rejects missing, failed, stale, and recursively required checks', () => {
  const base = {
    requiredNames: ['build + typecheck', 'Vercel'],
    reviewedSha: HEAD_SHA,
    checkRuns: [{ name: 'build + typecheck', conclusion: 'success', head_sha: HEAD_SHA, app: { slug: 'github-actions', id: 15368 }, workflow: { name: 'CI', path: '.github/workflows/ci.yml' } }],
    statuses: [{ context: 'Vercel', state: 'success', sha: HEAD_SHA, creator: { login: 'vercel[bot]' } }],
    previewName: 'Vercel',
    trustedChecks: websiteFixture().mission.trusted_checks,
    workflowBlobs: { '.github/workflows/ci.yml': { base: 'd'.repeat(40), head: 'd'.repeat(40), local: 'd'.repeat(40) } },
  };
  assert.throws(() => validateLiveEvidence({ ...base, requiredNames: ['valoir-shiploop'] }), /recursively/);
  assert.throws(() => validateLiveEvidence({ ...base, requiredNames: ['Rizz-ReviewLoop'] }), /recursively/);
  assert.throws(() => validateLiveEvidence({ ...base, statuses: [] }), /missing live required check/);
  assert.throws(() => validateLiveEvidence({ ...base, checkRuns: [{ ...base.checkRuns[0], conclusion: 'failure' }] }), /did not succeed/);
  assert.throws(() => validateLiveEvidence({ ...base, checkRuns: [{ name: 'build + typecheck', conclusion: 'success', head_sha: BASE_SHA }] }), /missing live required check/);
  assert.throws(() => validateLiveEvidence({ ...base, checkRuns: [{ name: 'build + typecheck', conclusion: 'success', head_sha: HEAD_SHA, app: { slug: 'attacker', id: 9 }, workflow: { name: 'CI', path: '.github/workflows/ci.yml' } }] }), /trusted provenance/);
  assert.throws(() => validateLiveEvidence({ ...base, workflowBlobs: { '.github/workflows/ci.yml': { base: 'd'.repeat(40), head: 'e'.repeat(40), local: 'e'.repeat(40) } } }), /workflow definition changed/);
});

test('trusted duplicate evidence wins over an untrusted same-name record', () => {
  const fixture = websiteFixture();
  const trusted = { name: 'build + typecheck', conclusion: 'success', head_sha: HEAD_SHA, app: { slug: 'github-actions', id: 15368 }, workflow: { name: 'CI', path: '.github/workflows/ci.yml' } };
  const result = validateLiveEvidence({
    requiredNames: fixture.mission.required_checks,
    trustedChecks: fixture.mission.trusted_checks,
    reviewedSha: HEAD_SHA,
    checkRuns: [{ ...trusted, app: { slug: 'attacker', id: 9 } }, trusted],
    statuses: [{ context: 'Vercel', state: 'success', sha: HEAD_SHA, creator: { login: 'vercel[bot]' } }],
    previewName: 'Vercel',
    workflowBlobs: { '.github/workflows/ci.yml': { base: 'd'.repeat(40), head: 'd'.repeat(40), local: 'd'.repeat(40) } },
  });
  assert.equal(result.requiredChecks[0].workflow_base_blob_sha, 'd'.repeat(40));
});

test('publisher paginates all GitHub check and status evidence', async () => {
  const source = await import('node:fs/promises').then(({ readFile }) => readFile('scripts/shiploop/publish-status.mjs', 'utf8'));
  assert.match(source, /check-runs[^\n]+--paginate/);
  assert.match(source, /statuses[^\n]+--paginate/);
  assert.match(source, /--slurp/);
});

test('workflow checks out the immutable PR head instead of the synthetic merge ref', async () => {
  const workflow = await import('node:fs/promises').then(({ readFile }) => readFile('.github/workflows/valoir-shiploop.yml', 'utf8'));
  assert.match(workflow, /ref: \$\{\{ github\.event\.pull_request\.head\.sha \}\}/);
});

test('runtime certificate expiry is derived from policy TTL', () => {
  const fixture = websiteFixture();
  fixture.policy.certificate_ttl_hours = 1;
  const certificate = buildCertificate({
    mission: fixture.mission,
    policy: fixture.policy,
    review: fixture.review,
    requiredChecks: fixture.certificate.required_checks,
    preview: fixture.certificate.preview,
    changedPaths: WEBSITE_CHANGES,
    generatedAt: NOW,
  });
  assert.equal(certificate.expires_at, '2026-07-11T11:00:00.000Z');
});
