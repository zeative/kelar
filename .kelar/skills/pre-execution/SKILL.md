---
name: pre-execution
description: >
  Handles planning and exploration before any code is written. This skill should be used
  when the user asks to build, implement, create, add, make, write, update, or change anything
  in the codebase. Triggers on: "build", "create", "implement", "add feature", "make",
  "write", "update", "change". Do not write any code until this skill completes.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
---

# Pre-Execution Protocol

No code is written without an approved plan.

## PHASE 1: EXPLORE

Read relevant codebase context:
1. Find 2-3 files similar to what you're creating/modifying
2. Find the layer where this code belongs
3. Find existing utilities/components you might reuse
4. Read `.kelar/state/STATE.md` if it exists

```
KELAR EXPLORE
─────────────
Files read   : [list]
Patterns     :
  Structure  : [observed]
  Naming     : [observed]
  Errors     : [observed]
  Reusable   : [existing code to reuse]
```

## PHASE 2: UNDERSTAND

```
KELAR UNDERSTAND
────────────────
Goal        : [one sentence]
Input       : [what goes in]
Output      : [what comes out]
Edges       : [edge cases to handle]
Out of scope: [what you will NOT do]
```

If anything is unclear → ask ONE clarifying question before continuing.

## PHASE 3: PLAN

Break into micro-tasks. Each task = max 1-2 files, one responsibility, clear done condition.

```
KELAR PLAN
──────────
Task: [name]

[ ] 1. [action] in [file] → done when: [condition]
[ ] 2. [action] in [file] → done when: [condition]
[ ] 3. [action] in [file] → done when: [condition]

Files to modify : [list]
Files to create : [list]
Files untouched : everything else

Approach:
  A) [approach] — [tradeoff]
  B) [approach] — [tradeoff]
Recommended: [A/B] because [reason]
```

## PHASE 4: AWAIT APPROVAL

**STOP. Do not write any code yet.**

Present the plan. Wait for: "yes" / edits / "no".
Only after explicit approval → execute.

## EXECUTION

For each micro-task:
1. Implement
2. Self-check from `code-quality` rule
3. Append to `.kelar/state/TASKS.md`: `[x] [timestamp] [task] — DONE`
4. Show brief result
