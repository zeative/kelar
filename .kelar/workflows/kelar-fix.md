---
name: kelar:fix
description: Debug and fix a bug using systematic root cause analysis. Traces errors minimum 3 levels deep, presents fix options, waits for user to choose before executing.
argument-hint: "<error description or paste error>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

# /kelar:fix

Debug with depth: Intake → Trace → Root Cause → Impact → Options → Approve → Fix → Verify.

## FLOW

Run `deep-debug` skill — full protocol.

1. **INTAKE** — collect full error + stack trace. If missing → ask first.
2. **TRACE** — follow error minimum 3 levels deep.
3. **ROOT CAUSE** — state in one sentence. Uncertain → two hypotheses + how to verify.
4. **IMPACT** — blast radius before fixing.
5. **OPTIONS** — present 2-3 fix options with tradeoffs. **Wait for user to choose.**
6. **EXECUTE** — apply chosen fix, scope-guarded, code-quality checked.
7. **VERIFY** — confirm root cause addressed, not just symptom.

## COMMIT
{{COMMIT_BEHAVIOR}}

## DONE → append to `.kelar/state/STATE.md`
```
## Fix: [Error] — [date]
- Root cause: [one sentence]
- Fixed in  : [file:line]
- Approach  : [what was done]
- Regression: none / [what was affected]
```
