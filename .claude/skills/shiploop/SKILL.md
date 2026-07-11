---
name: shiploop
description: Run the mandatory Valoir exact-SHA independent review and merge-readiness loop for every pull request, with bounded repairs and deterministic evidence.
compatibility: Requires git and gh authenticated for the target repository.
allowed-tools: Bash(gh:*) Bash(git:*)
---

# Valoir Shiploop

Use this skill for every website pull request before merge. The canonical operating details live in
the website brain at `runbooks/shiploop.md`; repository policy and artifacts are authoritative.

## Contract

1. Confirm approved intent, implementation plan, and `.valoir/mission-contract.json` match scope.
2. Identify the pull request base SHA and exact 40-character head SHA. Never reuse review evidence
   from a different head.
3. Confirm the implementation owner is not the adjudicator. Dispatch independent
   intent/architecture, correctness/risk, and experience review when applicable.
4. Adjudicate supported and unsupported findings with written evidence. Require zero unresolved
   P0/P1/P2 findings and zero unresolved comments.
5. If changes are required, send one bounded repair wave where practical, run proportional local
   checks, push, invalidate old approval, and review the complete new head SHA.
6. Stop with `BLOCKED` after five unsuccessful iterations. Record remaining findings and the next
   authorized actor; never approve because the cap was reached.
7. Require CI and Vercel preview evidence for the same SHA when UI changes apply.
8. Validate `.valoir/reviews/<head-sha>.json` and `.valoir/merge-readiness.json`, including the
   exact SHA, current TTL, reviewer independence, required checks, and deterministic hash.
9. Report `merge-ready` only when the `valoir-shiploop` check and all certificate gates pass.

Merge readiness is evidence, not authority to merge. After authorized merge, verify dev separately;
production still requires explicit approval and observation.
