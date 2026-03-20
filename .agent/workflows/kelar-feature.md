---
name: kelar:feature
description: Build a new feature end-to-end with planning, approval gates, and wave-based execution. Tracks all tasks in .kelar/state/TASKS.md.
argument-hint: "<feature description>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

# /kelar:feature

Build a feature end-to-end: Brief → Explore → Plan → Approve → Execute → Verify.

## STEP 1: BRIEF

Ask:
1. What does this feature do? (one sentence)
2. Who uses it / what triggers it?
3. Input/Output shape?
4. Edge cases?
5. What is explicitly OUT of scope?

```
KELAR FEATURE BRIEF
───────────────────
Feature     : [name]
Goal        : [one sentence]
Triggered by: [action/event]
Input       : [data in]
Output      : [result]
Edges       : [list]
Out of scope: [list]
```

Save to `.kelar/state/STATE.md` under `## Current Feature`.

## STEP 2: EXPLORE + CONSISTENCY

Run `pre-execution` skill Phase 1+2.
Run `consistency-guard` skill Phase 1+2.

## STEP 3: PLAN — Wave Structure

```
KELAR FEATURE PLAN
──────────────────
WAVE 1 — Foundation
[ ] 1.1 [task] in [file] → done when: [condition]
[ ] 1.2 [task] in [file] → done when: [condition]

WAVE 2 — Core Logic
[ ] 2.1 [task] in [file] → done when: [condition]

WAVE 3 — Integration
[ ] 3.1 [task] in [file] → done when: [condition]

Files to modify: [list]
Files to create: [list]
```

**STOP. Wait for user approval or edits before executing anything.**

## STEP 4: EXECUTE

For each micro-task:
1. Implement
2. Self-check from `code-quality` rule
3. Append to `.kelar/state/TASKS.md`: `[x] [timestamp] [task] — DONE`
4. Commit if autoCommit is enabled: `git add [files] && git commit -m "feat(kelar): [task]"`

After each wave:
```
KELAR WAVE [N] COMPLETE
───────────────────────
Completed: [list]
Next wave: [list]
Continue? (yes/no)
```

## STEP 5: VERIFY

```
KELAR VERIFY
────────────
[ ] Core functionality implemented
[ ] All edge cases handled
[ ] Error handling in place
[ ] UI consistent (if applicable)
[ ] Zero hardcoded values
[ ] Nothing outside scope modified
[ ] TASKS.md updated
```

## DONE → append to `.kelar/state/STATE.md`
```
## Completed: [Feature] — [date]
- Implemented: [summary]
- Files modified: [list]
- Decisions: [architectural decisions made]
```
