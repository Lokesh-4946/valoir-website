# AGENTS.md — Valoir website agent contract

Read `CLAUDE.md` and the website brain before non-trivial work. `CLAUDE.md` is the canonical repo
house style; this file adds the cross-agent review contract.

## Mandatory Shiploop contract

- Every implementation starts from approved intent and a mission contract.
- Implementation agents cannot approve their own work.
- Independent reviewers assess intent/architecture, correctness/risk, and experience when relevant.
- The adjudicator reviews the complete diff and evidence for the exact pull-request head SHA.
- Reviewer reports are evidence, not merge authority. Only an `APPROVE` review artifact with zero
  blocking findings and zero unresolved comments can support a merge-readiness certificate.
- Every new commit invalidates earlier approval and certification. Re-review the complete new SHA.
- Repair iterations are capped at five. Remaining blocking findings at the cap produce `BLOCKED`
  with evidence and the next authorized actor; the cap never converts findings into approval.
- CI and Vercel preview must pass for the reviewed SHA when applicable. Merge readiness does not
  merge automatically and does not authorize deployment.
- The product planner/orchestrator owns planner state. The knowledge curator appends evidence but
  cannot declare merge readiness. The release manager verifies a valid certificate before an
  authorized merge. Dev verification and production approval remain separate post-merge gates.

Use the repository-local `.claude/skills/shiploop/SKILL.md` and the brain's
`runbooks/shiploop.md` for the operational loop.
