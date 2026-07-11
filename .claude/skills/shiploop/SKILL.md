---
name: shiploop
description: Run the mandatory Valoir exact-SHA independent review and merge-readiness loop for every pull request, with bounded repairs and deterministic evidence.
compatibility: Requires git and gh authenticated for the target repository.
allowed-tools: Bash(gh:*) Bash(git:*) Bash(node:*) Bash(npm:*)
---

# Valoir Shiploop

Use this skill for every website pull request before merge. The canonical operating details live in
the website brain at `runbooks/shiploop.md`; repository policy and artifacts are authoritative.

## Availability gate

Before running the loop, verify the current checkout actually contains the Shiploop core contract:

- `.valoir/mission-contract.json`
- `.valoir/review-policy.yml`
- `scripts/shiploop/` validators
- `.github/workflows/valoir-shiploop.yml`

Do not invent these paths, fabricate artifacts, or claim the gate is installed when they are
absent. Report Shiploop execution `BLOCKED` pending the core commit, workflow/check availability,
and a push that creates the exact SHA to review. Once installed, discover the supported validator
commands from `package.json` and the checked-in scripts, then invoke them with `npm` or `node`.

## Contract

1. Confirm approved intent, implementation plan, and `.valoir/mission-contract.json` match scope.
2. Identify the pull request base SHA and exact 40-character head SHA. Never reuse review evidence
   from a different head.
3. Confirm the implementation owner is not the adjudicator. Use the available agent-dispatch
   mechanism to assign independent intent/architecture, correctness/risk, and experience review
   when applicable. If independent dispatch is unavailable, stop and name that blocker.
4. Adjudicate supported and unsupported findings with written evidence. Require zero unresolved
   P0/P1/P2 findings and zero unresolved comments.
5. If changes are required, send one bounded repair wave where practical, run proportional local
   checks, push, invalidate old approval, and review the complete new head SHA.
6. Stop with `BLOCKED` after five unsuccessful iterations. Record remaining findings and the next
   authorized actor; never approve because the cap was reached.
7. Require CI and Vercel preview evidence for the same SHA when UI changes apply.
8. Store review and certificate evidence outside the reviewed Git tree. Run the repository
   validators for those runtime paths, including exact SHA, current TTL, reviewer independence,
   trusted check issuer/workflow provenance, and deterministic hash. Never substitute prose.
9. Do not execute a pending-status publisher from PR-controlled code. The trusted orchestrator may
   publish `pending` directly with authenticated `gh` only after committed-gate validation. Invoke
   the success publisher only after independent review, and require its launcher path and complete
   `scripts/shiploop` Git tree SHA in reviewed evidence. The builtins-only launcher must reject any
   tracked or untracked dirt before dynamically importing privileged publisher modules.
10. Report `merge-ready` only when the `valoir-shiploop` check and all certificate gates pass.

Merge readiness is evidence, not authority to merge. After authorized merge, verify dev separately;
production still requires explicit approval and observation.
