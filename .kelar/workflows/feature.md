# KELAR Workflow: /kelar:feature

**Trigger:** User wants to build a new feature end-to-end.
**Usage:** `/kelar:feature [brief description]`

---

## OVERVIEW

```
BRIEF → EXPLORE → PLAN → APPROVE → EXECUTE (waves) → VERIFY → DONE
```

Every step is logged to .kelar/state/STATE.md. Every micro-task is tracked in .kelar/state/TASKS.md.
If session breaks at any point → `/kelar:resume` picks up exactly where you left off.

---

## STEP 1: BRIEF

Extract everything needed before touching the codebase.

Ask the user:
1. **What** — What does this feature do? (one sentence)
2. **Who** — Who uses it? What triggers it?
3. **Input/Output** — What goes in, what comes out?
4. **Edge cases** — What should happen when things go wrong?
5. **Scope** — What is explicitly NOT part of this feature?
6. **Reference** — Is there anything in the codebase similar to this?

Output:
```
KELAR FEATURE BRIEF
───────────────────
Feature   : [name]
Goal      : [one sentence]
Triggered by: [user action / system event]
Input     : [data that comes in]
Output    : [what gets produced/changed]
Edge cases: [list]
Out of scope: [list]
Reference : [similar existing code]
```

Save brief to .kelar/state/STATE.md under `## Current Feature`.

---

## STEP 2: EXPLORE

Run the **pre-execution** skill Phase 1 & 2.
Run the **consistency-guard** skill Phase 1 & 2.

Map the full implementation surface:
- Which files need to be created?
- Which files need to be modified?
- What existing utilities can be reused?
- What new utilities need to be created first?

---

## STEP 3: PLAN

Break feature into micro-tasks. Group into waves.

**Wave rules:**
- Wave = group of micro-tasks that can run sequentially
- New wave = when previous tasks must be complete first
- Each micro-task = max 1-2 files, one clear responsibility

Output:
```
KELAR FEATURE PLAN
──────────────────
Feature: [name]

WAVE 1 — Foundation
[ ] 1.1 [task] in [file] → done when: [condition]
[ ] 1.2 [task] in [file] → done when: [condition]

WAVE 2 — Core Logic  
[ ] 2.1 [task] in [file] → done when: [condition]
[ ] 2.2 [task] in [file] → done when: [condition]

WAVE 3 — Integration
[ ] 3.1 [task] in [file] → done when: [condition]

WAVE 4 — UI (if applicable)
[ ] 4.1 [task] in [file] → done when: [condition]

Total: [N] micro-tasks across [N] waves
Estimated files touched: [list]
```

**STOP. Wait for user approval or edits.**

---

## STEP 4: EXECUTE

After approval, execute wave by wave.

For each micro-task:
1. Implement the task
2. Run code-quality self-check
3. Mark complete in .kelar/state/TASKS.md: `[x] [timestamp] [task] — DONE`
4. Show brief output to user

After each wave, pause and confirm:
```
KELAR WAVE [N] COMPLETE
────────────────────────
Completed: [list of tasks]
Ready for Wave [N+1]: [list of next tasks]

Continue? (yes/no)
```

---

## STEP 5: VERIFY

After all waves complete, run end-to-end verification:

```
KELAR VERIFY
────────────
Feature goal: [restate from brief]

Checklist:
[ ] Core functionality implemented
[ ] All edge cases handled
[ ] Error handling in place
[ ] UI consistent with existing patterns (if applicable)
[ ] No hardcoded values
[ ] No code outside scope was modified
[ ] .kelar/state/TASKS.md fully updated

Status: COMPLETE ✓ / ISSUES FOUND ✗
```

If issues found → create fix tasks and loop back to STEP 4.

---

## .kelar/state/STATE.md UPDATE

After feature complete, append to .kelar/state/STATE.md:
```
## Completed: [Feature Name] — [date]
- Implemented: [summary]
- Files modified: [list]
- Decisions made: [any architectural decisions]
- Known limitations: [anything deferred to later]
```
