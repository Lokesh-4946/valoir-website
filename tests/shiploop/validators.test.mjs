import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parsePolicy, validatePolicy } from '../../scripts/shiploop/lib/policy.mjs';
import { validateMission } from '../../scripts/shiploop/lib/mission.mjs';
import { validateReview } from '../../scripts/shiploop/lib/review.mjs';
import { validateCertificate } from '../../scripts/shiploop/lib/certificate.mjs';
import { validateArtifactSet } from '../../scripts/shiploop/lib/artifacts.mjs';
import { BASE_SHA, HEAD_SHA, NOW, rizzFixture, websiteFixture } from './fixtures.mjs';

function expectCode(code, operation) {
  assert.throws(operation, (error) => error?.errors?.some((item) => item.code === code));
}

test('complete website and Rizz fixtures pass', () => {
  for (const fixture of [websiteFixture(), rizzFixture()]) {
    assert.doesNotThrow(() => validateArtifactSet(fixture, { headSha: HEAD_SHA, baseSha: BASE_SHA, now: NOW }));
  }
});

test('missing artifacts fail explicitly', () => {
  for (const artifact of ['mission', 'policy', 'review', 'certificate']) {
    const fixture = websiteFixture();
    delete fixture[artifact];
    expectCode(`missing_${artifact}`, () => validateArtifactSet(fixture, { headSha: HEAD_SHA, baseSha: BASE_SHA, now: NOW }));
  }
});

test('malformed and unknown schemas fail', () => {
  const fixture = websiteFixture();
  fixture.mission.schema_version = 2;
  expectCode('unsupported_schema_version', () => validateMission(fixture.mission));
  expectCode('invalid_type', () => validatePolicy({ ...fixture.policy, max_iterations: '5' }));
});

test('strict policy parser accepts the profile and rejects unknown or executable YAML', () => {
  const yaml = `schema_version: 1\nprofile: valoir-shiploop\nmax_iterations: 5\nrequired_reviewers:\n  - intent-architecture\n  - correctness-risk\n  - experience\nblocking_priorities: [P0, P1, P2]\nrequire_zero_unresolved: true\nrequire_exact_head_sha: true\nrequire_ci_green: true\nrequire_preview_when_ui_changes: true\ncertificate_ttl_hours: 24\n`;
  assert.equal(parsePolicy(yaml).profile, 'valoir-shiploop');
  expectCode('unknown_field', () => parsePolicy(`${yaml}privileged: true\n`));
  expectCode('invalid_yaml', () => parsePolicy(`${yaml}payload: !!js/function >\n  process.exit()\n`));
});

test('SHA and base mismatches fail', () => {
  const fixture = websiteFixture();
  expectCode('head_sha_mismatch', () => validateReview(fixture.review, { mission: fixture.mission, policy: fixture.policy, headSha: 'c'.repeat(40), baseSha: BASE_SHA }));
  expectCode('base_sha_mismatch', () => validateReview(fixture.review, { mission: fixture.mission, policy: fixture.policy, headSha: HEAD_SHA, baseSha: 'c'.repeat(40) }));
});

test('self-review and missing reviewer roles fail', () => {
  const fixture = websiteFixture();
  fixture.review.adjudicator = fixture.review.implementation_owner;
  expectCode('self_review', () => validateReview(fixture.review, { mission: fixture.mission, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
  const missing = websiteFixture();
  missing.review.reviewers.pop();
  expectCode('missing_reviewer', () => validateReview(missing.review, { mission: missing.mission, policy: missing.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
});

test('blocking findings, unresolved comments, and contradictory approval fail', () => {
  const fixture = websiteFixture();
  fixture.review.findings = [{ id: 'F-1', priority: 'P1', category: 'correctness', file: 'src/a.ts', line_start: 2, line_end: 3, evidence: 'Throws.', required_change: 'Handle error.', status: 'open', adjudication_rationale: 'Confirmed.' }];
  expectCode('blocking_finding', () => validateReview(fixture.review, { mission: fixture.mission, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
  const comments = websiteFixture();
  comments.review.unresolved_comment_count = 1;
  expectCode('unresolved_comments', () => validateReview(comments.review, { mission: comments.mission, policy: comments.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
});

test('invalid iterations and cap behavior fail', () => {
  for (const iteration of [0, 6]) {
    const fixture = websiteFixture();
    fixture.review.iteration = iteration;
    expectCode('invalid_iteration', () => validateReview(fixture.review, { mission: fixture.mission, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
  }
  const capped = websiteFixture();
  capped.review.iteration = 5;
  capped.review.verdict = 'REQUEST_CHANGES';
  expectCode('iteration_cap_requires_blocked', () => validateReview(capped.review, { mission: capped.mission, policy: capped.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
});

test('traversal and outside-repository evidence paths fail', () => {
  const fixture = websiteFixture();
  fixture.mission.expected_paths = ['../other-repo'];
  expectCode('path_traversal', () => validateMission(fixture.mission));
  const review = websiteFixture();
  review.review.findings = [{ id: 'F-1', priority: 'P3', category: 'docs', file: '/tmp/proof', evidence: 'External.', required_change: 'None.', status: 'resolved', adjudication_rationale: 'Rejected.' }];
  expectCode('unsafe_path', () => validateReview(review.review, { mission: review.mission, policy: review.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
});

test('missing, failed, stale, or recursive checks fail', () => {
  const mutations = [
    ['missing_required_check', (f) => f.certificate.required_checks.pop()],
    ['failed_required_check', (f) => { f.certificate.required_checks[0].conclusion = 'failure'; }],
    ['check_sha_mismatch', (f) => { f.certificate.required_checks[0].sha = 'c'.repeat(40); }],
    ['recursive_check', (f) => { f.review.required_checks.push('valoir-shiploop'); f.certificate.required_checks.push({ name: 'valoir-shiploop', conclusion: 'success', sha: HEAD_SHA }); }],
  ];
  for (const [code, mutate] of mutations) {
    const fixture = websiteFixture();
    mutate(fixture);
    expectCode(code, () => validateCertificate(fixture.certificate, { mission: fixture.mission, review: fixture.review, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA, now: NOW }));
  }
});

test('expired or overlong certificates fail', () => {
  const expired = websiteFixture();
  expired.certificate.expires_at = '2026-07-11T09:59:59.000Z';
  expectCode('certificate_expired', () => validateCertificate(expired.certificate, { mission: expired.mission, review: expired.review, policy: expired.policy, headSha: HEAD_SHA, baseSha: BASE_SHA, now: NOW }));
  const overlong = websiteFixture();
  overlong.certificate.expires_at = '2026-07-13T09:30:00.000Z';
  expectCode('certificate_ttl_exceeded', () => validateCertificate(overlong.certificate, { mission: overlong.mission, review: overlong.review, policy: overlong.policy, headSha: HEAD_SHA, baseSha: BASE_SHA, now: NOW }));
});

test('modified mission, modified review, forged hash, and stale certificate fail', () => {
  const cases = [
    ['mission_hash_mismatch', (f) => { f.mission.intent = 'Changed scope'; }],
    ['review_hash_mismatch', (f) => { f.review.generated_at = '2026-07-11T09:01:00.000Z'; }],
    ['forged_certificate_hash', (f) => { f.certificate.certificate_hash = '0'.repeat(64); }],
    ['head_sha_mismatch', (f) => { f.certificate.reviewed_sha = 'c'.repeat(40); }],
  ];
  for (const [code, mutate] of cases) {
    const fixture = websiteFixture();
    mutate(fixture);
    expectCode(code, () => validateCertificate(fixture.certificate, { mission: fixture.mission, review: fixture.review, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA, now: NOW }));
  }
});
