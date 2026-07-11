import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parsePolicy, validatePolicy } from '../../scripts/shiploop/lib/policy.mjs';
import { validateMission } from '../../scripts/shiploop/lib/mission.mjs';
import { validateReview } from '../../scripts/shiploop/lib/review.mjs';
import { validateCertificate } from '../../scripts/shiploop/lib/certificate.mjs';
import { validateArtifactSet } from '../../scripts/shiploop/lib/artifacts.mjs';
import { certificateHash, normalizedHash } from '../../scripts/shiploop/lib/hash.mjs';
import { BASE_SHA, HEAD_SHA, NOW, rizzFixture, websiteFixture } from './fixtures.mjs';

function expectCode(code, operation) {
  assert.throws(operation, (error) => error?.errors?.some((item) => item.code === code));
}

test('complete website and Rizz fixtures pass', () => {
  for (const fixture of [websiteFixture(), rizzFixture()]) {
    const uiChanges = fixture.policy.profile === 'valoir-shiploop';
    assert.doesNotThrow(() => validateArtifactSet(fixture, { headSha: HEAD_SHA, baseSha: BASE_SHA, now: NOW, uiChanges }));
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
  const yaml = `schema_version: 1\nprofile: valoir-shiploop\nmax_iterations: 5\nrequired_reviewers:\n  - intent-architecture\n  - correctness-risk\n  - experience\nallow_multi_role_reviewer: false\nblocking_priorities: [P0, P1, P2]\nrequire_zero_unresolved: true\nrequire_exact_head_sha: true\nrequire_ci_green: true\nrequire_preview_when_ui_changes: true\ncertificate_ttl_hours: 24\n`;
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

test('policy requires a nonempty reviewer panel and approval requires actual reviewer coverage', () => {
  const fixture = websiteFixture();
  expectCode('invalid_type', () => validatePolicy({ ...fixture.policy, required_reviewers: [] }));
  const emptyCoverage = websiteFixture();
  emptyCoverage.policy.required_reviewers = [];
  emptyCoverage.review.reviewers = [];
  expectCode('missing_reviewer', () => validateReview(emptyCoverage.review, { mission: emptyCoverage.mission, policy: emptyCoverage.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
});

test('finding buckets enforce statuses and globally unique stable IDs', () => {
  const finding = { id: 'F-1', priority: 'P3', category: 'docs', file: 'src/a.ts', evidence: 'Typo.', required_change: 'Correct it.', status: 'resolved', adjudication_rationale: 'Fixed.' };
  const wrongActive = websiteFixture();
  wrongActive.review.findings = [finding];
  expectCode('finding_bucket_mismatch', () => validateReview(wrongActive.review, { mission: wrongActive.mission, policy: wrongActive.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
  const wrongResolved = websiteFixture();
  wrongResolved.review.resolved_findings = [{ ...finding, status: 'open' }];
  expectCode('finding_bucket_mismatch', () => validateReview(wrongResolved.review, { mission: wrongResolved.mission, policy: wrongResolved.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
  const duplicate = websiteFixture();
  duplicate.review.findings = [{ ...finding, status: 'open' }];
  duplicate.review.resolved_findings = [finding];
  duplicate.review.verdict = 'REQUEST_CHANGES';
  expectCode('duplicate_finding_id', () => validateReview(duplicate.review, { mission: duplicate.mission, policy: duplicate.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
});

test('preview evidence is derived from policy and UI-change applicability', () => {
  const uiChange = websiteFixture();
  uiChange.certificate.preview = { required: false, conclusion: 'not_required', sha: HEAD_SHA };
  expectCode('preview_required', () => validateCertificate(uiChange.certificate, { mission: uiChange.mission, review: uiChange.review, policy: uiChange.policy, headSha: HEAD_SHA, baseSha: BASE_SHA, now: NOW, uiChanges: true }));
  const nonUi = websiteFixture();
  nonUi.review.ui_changes = false;
  nonUi.certificate.review_artifact_hash = normalizedHash(nonUi.review);
  nonUi.certificate.certificate_hash = certificateHash({ mission: nonUi.mission, review: nonUi.review, requiredChecks: nonUi.certificate.required_checks, reviewedSha: HEAD_SHA });
  nonUi.certificate.preview = { required: true, conclusion: 'success', sha: HEAD_SHA };
  assert.doesNotThrow(() => validateCertificate(nonUi.certificate, { mission: nonUi.mission, review: nonUi.review, policy: nonUi.policy, headSha: HEAD_SHA, baseSha: BASE_SHA, now: NOW, uiChanges: false }));
});

test('intent failure or uncertainty is allowed only for negative verdicts', () => {
  for (const intent_alignment of ['fail', 'uncertain']) {
    const negative = websiteFixture();
    negative.review.intent_alignment = intent_alignment;
    negative.review.verdict = 'BLOCKED';
    negative.review.blockers = [{ code: 'intent_alignment', evidence: `Intent alignment is ${intent_alignment}.` }];
    negative.review.next_authorized_actor = 'product-owner';
    negative.review.escalation = 'Clarify or repair intent alignment.';
    assert.doesNotThrow(() => validateReview(negative.review, { mission: negative.mission, policy: negative.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
    const approved = websiteFixture();
    approved.review.intent_alignment = intent_alignment;
    expectCode('intent_misalignment', () => validateReview(approved.review, { mission: approved.mission, policy: approved.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
  }
});

test('Rizz evidence is strict, typed, and rejects unknown fields', () => {
  const unknown = rizzFixture();
  unknown.review.rizz_evidence.secret = 'no';
  expectCode('unknown_field', () => validateReview(unknown.review, { mission: unknown.mission, policy: unknown.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
  const badCount = rizzFixture();
  badCount.review.rizz_evidence.true_positives = -1;
  expectCode('invalid_rizz_evidence', () => validateReview(badCount.review, { mission: badCount.mission, policy: badCount.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
  const badPrompts = rizzFixture();
  badPrompts.review.rizz_evidence.useful_prompts = [1];
  expectCode('invalid_type', () => validateReview(badPrompts.review, { mission: badPrompts.mission, policy: badPrompts.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
});

test('repository paths reject schemes, absolute paths, drive paths, and traversal', () => {
  for (const unsafe of ['https://example.com/proof', 'file:///tmp/proof', '/tmp/proof', 'C:\\proof', '..\\proof']) {
    const fixture = websiteFixture();
    fixture.mission.expected_paths = [unsafe];
    expectCode(unsafe.includes('..') ? 'path_traversal' : 'unsafe_path', () => validateMission(fixture.mission));
  }
});

test('certificate time is causal and obeys review <= certificate <= now < expiry', () => {
  const contexts = (fixture, now) => ({ mission: fixture.mission, review: fixture.review, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA, now });
  const invalidNow = websiteFixture();
  expectCode('invalid_now', () => validateCertificate(invalidNow.certificate, contexts(invalidNow, 'not-a-time')));
  const reviewAfterCertificate = websiteFixture();
  reviewAfterCertificate.review.generated_at = '2026-07-11T09:31:00.000Z';
  reviewAfterCertificate.certificate.review_artifact_hash = normalizedHash(reviewAfterCertificate.review);
  reviewAfterCertificate.certificate.certificate_hash = certificateHash({ mission: reviewAfterCertificate.mission, review: reviewAfterCertificate.review, requiredChecks: reviewAfterCertificate.certificate.required_checks, reviewedSha: HEAD_SHA });
  expectCode('noncausal_timestamp', () => validateCertificate(reviewAfterCertificate.certificate, contexts(reviewAfterCertificate, NOW)));
  const futureCertificate = websiteFixture();
  expectCode('noncausal_timestamp', () => validateCertificate(futureCertificate.certificate, contexts(futureCertificate, '2026-07-11T09:29:59.000Z')));
  const expiryEquality = websiteFixture();
  expectCode('certificate_expired', () => validateCertificate(expiryEquality.certificate, contexts(expiryEquality, expiryEquality.certificate.expires_at)));
});

test('identities must be trimmed and contain no surrounding whitespace', () => {
  for (const mutate of [
    (f) => { f.mission.approved_by = ' product-owner'; },
    (f) => { f.review.implementation_owner = 'implementer-1 '; },
    (f) => { f.review.adjudicator = '\tadjudicator-1'; },
    (f) => { f.review.reviewers[0].id = ' reviewer-a '; },
  ]) {
    const fixture = websiteFixture();
    mutate(fixture);
    expectCode('invalid_identity', () => validateArtifactSet(fixture, { headSha: HEAD_SHA, baseSha: BASE_SHA, now: NOW, uiChanges: true }));
  }
});

test('company reviewer roles are mandatory and experience is additive for UI changes', () => {
  const fixture = websiteFixture();
  expectCode('weakened_policy', () => validatePolicy({ ...fixture.policy, required_reviewers: ['experience'] }));
  const uiPolicy = { ...fixture.policy, required_reviewers: ['intent-architecture', 'correctness-risk'] };
  const uiReview = { ...fixture.review, reviewers: fixture.review.reviewers.filter(({ role }) => role !== 'experience') };
  expectCode('missing_reviewer', () => validateReview(uiReview, { mission: fixture.mission, policy: uiPolicy, headSha: HEAD_SHA, baseSha: BASE_SHA, uiChanges: true }));
  uiReview.ui_changes = false;
  assert.doesNotThrow(() => validateReview(uiReview, { mission: fixture.mission, policy: uiPolicy, headSha: HEAD_SHA, baseSha: BASE_SHA, uiChanges: false }));
});

test('terminal BLOCKED reviews require strict blocker evidence and escalation ownership', () => {
  const missing = websiteFixture();
  missing.review.iteration = 5;
  missing.review.verdict = 'BLOCKED';
  expectCode('missing_blocker_evidence', () => validateReview(missing.review, { mission: missing.mission, policy: missing.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
  const malformed = websiteFixture();
  malformed.review.iteration = 5;
  malformed.review.verdict = 'BLOCKED';
  malformed.review.blockers = [{ code: 'reviewer_unavailable', evidence: 'Experience reviewer unavailable.', secret: true }];
  malformed.review.next_authorized_actor = 'product-owner';
  malformed.review.escalation = 'Assign an independent reviewer.';
  expectCode('unknown_field', () => validateReview(malformed.review, { mission: malformed.mission, policy: malformed.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
});

test('BLOCKED may document missing reviewer roles but APPROVE requires full coverage', () => {
  const fixture = websiteFixture();
  fixture.review.iteration = 5;
  fixture.review.verdict = 'BLOCKED';
  fixture.review.reviewers = fixture.review.reviewers.filter(({ role }) => role !== 'experience');
  fixture.review.blockers = [{ code: 'missing_reviewer', evidence: 'No independent experience reviewer is available.' }];
  fixture.review.next_authorized_actor = 'product-owner';
  fixture.review.escalation = 'Assign an experience reviewer and start a new authorized run.';
  assert.doesNotThrow(() => validateReview(fixture.review, { mission: fixture.mission, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA, uiChanges: true }));
  fixture.review.verdict = 'APPROVE';
  expectCode('missing_reviewer', () => validateReview(fixture.review, { mission: fixture.mission, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA, uiChanges: true }));
});

test('RFC3339 timestamps reject impossible calendar dates by exact roundtrip', () => {
  for (const impossible of ['2026-02-30T08:00:00.000Z', '2026-04-31T08:00:00Z']) {
    const fixture = websiteFixture();
    fixture.mission.created_at = impossible;
    expectCode('invalid_timestamp', () => validateMission(fixture.mission));
  }
});

test('company policy cannot disable UI preview and UI applicability always activates experience', () => {
  const fixture = websiteFixture();
  expectCode('weakened_policy', () => validatePolicy({ ...fixture.policy, require_preview_when_ui_changes: false }));
  const weakened = { ...fixture.policy, require_preview_when_ui_changes: false, required_reviewers: ['intent-architecture', 'correctness-risk'] };
  const review = { ...fixture.review, reviewers: fixture.review.reviewers.filter(({ role }) => role !== 'experience') };
  expectCode('missing_reviewer', () => validateReview(review, { mission: fixture.mission, policy: weakened, headSha: HEAD_SHA, baseSha: BASE_SHA, uiChanges: true }));
});

test('multi-role reviewer identities require an explicit policy opt-in', () => {
  const fixture = websiteFixture();
  fixture.review.reviewers[1].id = fixture.review.reviewers[0].id;
  expectCode('duplicate_reviewer_identity', () => validateReview(fixture.review, { mission: fixture.mission, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
  const optedIn = { ...fixture.policy, allow_multi_role_reviewer: true };
  fixture.review.risk_level = 'low';
  fixture.review.ui_changes = false;
  assert.doesNotThrow(() => validateReview(fixture.review, { mission: fixture.mission, policy: optedIn, headSha: HEAD_SHA, baseSha: BASE_SHA, uiChanges: false }));
  expectCode('invalid_type', () => validatePolicy({ ...fixture.policy, allow_multi_role_reviewer: undefined }));
});

test('blocker and escalation metadata is forbidden outside BLOCKED verdicts', () => {
  for (const verdict of ['APPROVE', 'REQUEST_CHANGES']) {
    const fixture = websiteFixture();
    fixture.review.verdict = verdict;
    fixture.review.blockers = [{ code: 'stale', evidence: 'Must not survive verdict transition.' }];
    fixture.review.next_authorized_actor = 'product-owner';
    fixture.review.escalation = 'Repair the review.';
    expectCode('unexpected_blocker_evidence', () => validateReview(fixture.review, { mission: fixture.mission, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
  }
});

test('finding line ranges are positive atomic pairs or null pairs', () => {
  const baseFinding = { id: 'F-1', priority: 'P3', category: 'docs', file: 'src/a.ts', evidence: 'Typo.', required_change: 'Correct it.', status: 'open', adjudication_rationale: 'Confirmed.' };
  for (const lines of [{ line_start: 0, line_end: 1 }, { line_start: 2 }, { line_start: null, line_end: 2 }, { line_start: 4, line_end: 3 }]) {
    const fixture = websiteFixture();
    fixture.review.findings = [{ ...baseFinding, ...lines }];
    fixture.review.verdict = 'REQUEST_CHANGES';
    expectCode('invalid_line_range', () => validateReview(fixture.review, { mission: fixture.mission, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
  }
  for (const lines of [{ line_start: null, line_end: null }, { line_start: 2, line_end: 3 }]) {
    const fixture = websiteFixture();
    fixture.review.findings = [{ ...baseFinding, ...lines }];
    fixture.review.verdict = 'REQUEST_CHANGES';
    assert.doesNotThrow(() => validateReview(fixture.review, { mission: fixture.mission, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
  }
});

test('CI baseline requires nonempty mission checks and certificate cross-enforces policy', () => {
  const fixture = websiteFixture();
  fixture.mission.required_checks = [];
  expectCode('missing_required_check', () => validateMission(fixture.mission));
  expectCode('missing_required_check', () => validateCertificate(fixture.certificate, { mission: fixture.mission, review: fixture.review, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA, now: NOW, uiChanges: true }));
});

test('multi-role review requires explicit low-risk non-UI non-security evidence', () => {
  for (const evidence of [
    { risk_level: 'medium', ui_changes: false, security_sensitive: false },
    { risk_level: 'low', ui_changes: true, security_sensitive: false },
    { risk_level: 'low', ui_changes: false, security_sensitive: true },
  ]) {
    const fixture = websiteFixture();
    fixture.policy.allow_multi_role_reviewer = true;
    fixture.review.reviewers[1].id = fixture.review.reviewers[0].id;
    Object.assign(fixture.review, evidence);
    expectCode('multi_role_not_applicable', () => validateReview(fixture.review, { mission: fixture.mission, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA, uiChanges: evidence.ui_changes }));
  }
  const mismatch = websiteFixture();
  mismatch.review.ui_changes = false;
  expectCode('applicability_mismatch', () => validateReview(mismatch.review, { mission: mismatch.mission, policy: mismatch.policy, headSha: HEAD_SHA, baseSha: BASE_SHA, uiChanges: true }));
});

test('identity independence and duplicate checks are case-insensitive', () => {
  const selfReview = websiteFixture();
  selfReview.review.adjudicator = 'IMPLEMENTER-1';
  expectCode('self_review', () => validateReview(selfReview.review, { mission: selfReview.mission, policy: selfReview.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
  const duplicate = websiteFixture();
  duplicate.review.reviewers[1].id = 'REVIEWER-A';
  expectCode('duplicate_reviewer_identity', () => validateReview(duplicate.review, { mission: duplicate.mission, policy: duplicate.policy, headSha: HEAD_SHA, baseSha: BASE_SHA }));
});

test('preview conclusions are strict and consistent with required state', () => {
  for (const [code, preview, uiChanges] of [
    ['invalid_preview_conclusion', { required: false, conclusion: 'maybe', sha: HEAD_SHA }, false],
    ['preview_state_mismatch', { required: false, conclusion: 'success', sha: HEAD_SHA }, false],
    ['preview_failed', { required: true, conclusion: 'skipped', sha: HEAD_SHA }, true],
  ]) {
    const fixture = websiteFixture();
    fixture.review.ui_changes = uiChanges;
    fixture.certificate.review_artifact_hash = normalizedHash(fixture.review);
    fixture.certificate.certificate_hash = certificateHash({ mission: fixture.mission, review: fixture.review, requiredChecks: fixture.certificate.required_checks, reviewedSha: HEAD_SHA });
    fixture.certificate.preview = preview;
    expectCode(code, () => validateCertificate(fixture.certificate, { mission: fixture.mission, review: fixture.review, policy: fixture.policy, headSha: HEAD_SHA, baseSha: BASE_SHA, now: NOW, uiChanges }));
  }
});
