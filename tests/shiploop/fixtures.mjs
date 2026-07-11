import { certificateHash, normalizedHash } from '../../scripts/shiploop/lib/hash.mjs';

export const HEAD_SHA = 'a'.repeat(40);
export const BASE_SHA = 'b'.repeat(40);
export const NOW = '2026-07-11T10:00:00.000Z';

export function websiteFixture() {
  const mission = {
    schema_version: 1,
    contract_id: 'VAL-2026-001',
    product: 'valoir-website',
    intent: 'Update the website for Rizz 0.3.0.',
    approved_design: 'product-brain/specs/website.md',
    implementation_plan: 'product-brain/plans/website.md',
    expected_paths: ['src/', 'tests/ui/'],
    forbidden_paths: ['secrets/'],
    acceptance_criteria: ['Build and UI tests pass.'],
    required_checks: ['build + typecheck', 'Vercel'],
    created_at: '2026-07-11T08:00:00.000Z',
    approved_by: 'product-owner',
  };
  const policy = {
    schema_version: 1,
    profile: 'valoir-shiploop',
    max_iterations: 5,
    required_reviewers: ['intent-architecture', 'correctness-risk', 'experience'],
    allow_multi_role_reviewer: false,
    blocking_priorities: ['P0', 'P1', 'P2'],
    require_zero_unresolved: true,
    require_exact_head_sha: true,
    require_ci_green: true,
    require_preview_when_ui_changes: true,
    certificate_ttl_hours: 24,
  };
  const review = {
    schema_version: 1,
    reviewed_sha: HEAD_SHA,
    base_sha: BASE_SHA,
    iteration: 1,
    mission_contract_id: mission.contract_id,
    mission_contract_hash: normalizedHash(mission),
    implementation_owner: 'implementer-1',
    adjudicator: 'adjudicator-1',
    reviewers: [
      { id: 'reviewer-a', role: 'intent-architecture' },
      { id: 'reviewer-b', role: 'correctness-risk' },
      { id: 'reviewer-c', role: 'experience' },
    ],
    intent_alignment: 'pass',
    findings: [],
    resolved_findings: [],
    unresolved_comment_count: 0,
    required_checks: ['build + typecheck', 'Vercel'],
    rizz_evidence: null,
    verdict: 'APPROVE',
    generated_at: '2026-07-11T09:00:00.000Z',
  };
  const requiredChecks = [
    { name: 'build + typecheck', conclusion: 'success', sha: HEAD_SHA },
    { name: 'Vercel', conclusion: 'success', sha: HEAD_SHA },
  ];
  const certificate = {
    schema_version: 1,
    reviewed_sha: HEAD_SHA,
    base_sha: BASE_SHA,
    mission_contract_id: mission.contract_id,
    mission_contract_hash: normalizedHash(mission),
    review_artifact_hash: normalizedHash(review),
    required_checks: requiredChecks,
    preview: { required: true, conclusion: 'success', sha: HEAD_SHA },
    adjudicator: review.adjudicator,
    generated_at: '2026-07-11T09:30:00.000Z',
    expires_at: '2026-07-12T09:30:00.000Z',
  };
  certificate.certificate_hash = certificateHash({ mission, review, requiredChecks, reviewedSha: HEAD_SHA });
  return { mission, policy, review, certificate };
}

export function rizzFixture() {
  const fixture = websiteFixture();
  fixture.mission.contract_id = 'RIZZ-2026-001';
  fixture.mission.product = 'rizz';
  fixture.mission.required_checks = ['unit', 'PI-Bench', 'package', 'CLI smoke', 'cross-platform', 'footprint'];
  fixture.policy.profile = 'rizz-reviewloop';
  fixture.review.mission_contract_id = fixture.mission.contract_id;
  fixture.review.mission_contract_hash = normalizedHash(fixture.mission);
  fixture.review.required_checks = [...fixture.mission.required_checks];
  fixture.review.rizz_evidence = {
    cli_version: '0.3.0',
    true_positives: 2,
    false_positives: 1,
    missed_findings: 0,
    useful_prompts: ['Investigate dependency boundary.'],
    investigation_minutes_saved: 15,
  };
  fixture.certificate.mission_contract_id = fixture.mission.contract_id;
  fixture.certificate.mission_contract_hash = normalizedHash(fixture.mission);
  fixture.certificate.review_artifact_hash = normalizedHash(fixture.review);
  fixture.certificate.required_checks = fixture.mission.required_checks.map((name) => ({ name, conclusion: 'success', sha: HEAD_SHA }));
  fixture.certificate.preview = { required: false, conclusion: 'not_required', sha: HEAD_SHA };
  fixture.certificate.certificate_hash = certificateHash({ mission: fixture.mission, review: fixture.review, requiredChecks: fixture.certificate.required_checks, reviewedSha: HEAD_SHA });
  return fixture;
}
