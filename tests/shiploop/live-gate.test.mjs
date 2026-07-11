import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { buildCertificate, requireExternalEvidencePath } from '../../scripts/shiploop/lib/runtime-evidence.mjs';
import { verifyPublicationTarget } from '../../scripts/shiploop/lib/publication.mjs';
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
    assert.throws(() => requireExternalEvidencePath(join(repo, 'review.json'), repo), /outside the reviewed repository/);
    assert.equal(requireExternalEvidencePath(join(tmpdir(), 'shiploop-evidence', 'review.json'), repo), join(tmpdir(), 'shiploop-evidence', 'review.json'));
  } finally {
    await rm(repo, { recursive: true, force: true });
  }
});

test('publisher refuses checked-out SHA that differs from requested or remote PR head', async () => {
  await assert.rejects(
    verifyPublicationTarget({ requestedSha: HEAD_SHA, checkedOutSha: BASE_SHA, remotePrHeadSha: HEAD_SHA }),
    /checked-out HEAD/,
  );
  await assert.rejects(
    verifyPublicationTarget({ requestedSha: HEAD_SHA, checkedOutSha: HEAD_SHA, remotePrHeadSha: BASE_SHA }),
    /remote PR head/,
  );
});

test('publisher accepts only one exact SHA across certificate, checkout, and remote PR', async () => {
  assert.equal(
    await verifyPublicationTarget({ requestedSha: HEAD_SHA, checkedOutSha: HEAD_SHA, remotePrHeadSha: HEAD_SHA }),
    HEAD_SHA,
  );
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
