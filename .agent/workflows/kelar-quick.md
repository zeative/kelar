---
name: kelar:quick
description: Execute a small focused task with full guardrails but no heavy planning. Use for 1-3 file changes, quick edits, small additions. Escalate to /kelar:feature if 4+ files or architecture decisions needed.
argument-hint: "<task description>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# /kelar:quick

Small task. Full guardrails. No heavy planning.

## ESCALATE TO /kelar:feature IF
- 4+ files need changing
- New architecture decisions needed
- Significant regression risk

## FLOW

1. **SCAN** — read file(s) to modify, identify patterns to follow

2. **CONFIRM**
```
KELAR QUICK
───────────
Task    : [what]
File(s) : [where]
Approach: [how]
Proceed? (yes/no)
```

3. **EXECUTE** — implement, follow all code-quality rules, no scope creep

4. **DONE**
```
KELAR QUICK DONE
─────────────────
Done  : [what changed]
File  : [file:line]
Check : code quality passed ✓
```

5. Append to `.kelar/state/TASKS.md`: `[x] [timestamp] quick: [task] — DONE`

6. Commit if autoCommit enabled: `git add [files] && git commit -m "feat(kelar): [task]"`

## STILL APPLIES
All rules: zero hardcode, scope guard, consistency.
Out-of-scope observations → `.kelar/state/DEBT.md`, never silent fixes.
