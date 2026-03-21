---
name: kelar:feature
description: >
  Build a new feature end-to-end. Full multi-agent pipeline with parallel research,
  XML planning, plan validation, parallel wave execution, node repair, and verification.
  The most powerful KELAR workflow.
argument-hint: "<feature description>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
---

# /kelar:feature

{{LANGUAGE}}

---

## STEP 0: CONTEXT LOAD

```bash
node .kelar/kelar-tools.cjs health
node .kelar/kelar-tools.cjs state snapshot
node .kelar/kelar-tools.cjs handoff read
node .kelar/kelar-tools.cjs memory search "[feature topic]"
```

If health check fails → run `/kelar:map` first.

Log session start:
```bash
node .kelar/kelar-tools.cjs tasks log feature_start "[feature name from argument]"
```

---

## STEP 1: BRIEF

Collect all info at once:

```
KELAR FEATURE BRIEF
───────────────────
Feature     : [name]
Goal        : [one sentence — user-facing outcome]
Triggered by: [what causes this feature to run]
Input       : [data shape]
Output      : [result shape]
Edge cases  : [list]
Out of scope: [explicit list]
Has UI      : [yes / no]
Size        : [tiny=1-2 tasks / small=3-6 / medium=7-15 / large=15+]
```

Save to STATE.md:
```bash
node .kelar/kelar-tools.cjs state patch "Working on" "[feature name]"
```

---

## STEP 2: PARALLEL RESEARCH + UI CONTRACT

For medium/large features, spawn in parallel:

**Always:**
```
Task(
  subagent_type="general-purpose",
  prompt="""You are kelar-researcher. Research [feature name].
  
  Feature: [brief summary]
  Stack: [from snapshot]
  
  Investigate:
  1. Relevant libraries/APIs and their current stable patterns
  2. Existing codebase patterns to follow (grep-based)
  3. Utilities to reuse (don't reinvent)
  4. Known gotchas for this approach
  
  First check memory:
  $(node .kelar/kelar-tools.cjs memory search "[feature topic]")
  
  Write findings to .kelar/research/[feature-slug]-research.md
  
  <files_to_read>
  AGENTS.md
  .kelar/state/STATE.md
  .kelar/memory/INDEX.md
  </files_to_read>"""
)
```

**If Has UI = yes, simultaneously:**
```
Task(
  subagent_type="general-purpose",
  prompt="""You are kelar-ui-designer. Create design contract for [feature name].
  
  Components needed: [from brief]
  
  Scan existing design system, define all 8 states per component,
  specify breakpoints and accessibility requirements.
  Write to .kelar/research/[feature-slug]-ui-contract.md
  
  <files_to_read>
  AGENTS.md
  .kelar/state/STATE.md
  </files_to_read>"""
)
```

Wait for both. Read their output files before proceeding.

---

## STEP 3: PLAN

```
Task(
  subagent_type="general-purpose",
  prompt="""You are kelar-planner. Create XML plan for [feature name].
  
  Brief: [paste brief]
  Research: [paste key findings from research file]
  UI contract: [paste from ui-contract file if exists]
  
  Output: a complete <kelar_plan> XML.
  Save to .kelar/plans/[feature-slug]-plan.xml
  
  <files_to_read>
  AGENTS.md
  .kelar/state/STATE.md
  .kelar/state/PATTERNS.md
  .kelar/research/[feature-slug]-research.md
  </files_to_read>"""
)
```

---

## STEP 4: PLAN VALIDATION

```bash
node .kelar/kelar-tools.cjs plan validate .kelar/plans/[feature-slug]-plan.xml
```

If errors → fix the plan before continuing (ask planner to revise with specific issues).

Then spawn plan-checker:
```
Task(
  subagent_type="general-purpose",
  prompt="""You are kelar-plan-checker. Validate this plan before execution.
  
  <files_to_read>
  .kelar/plans/[feature-slug]-plan.xml
  .kelar/state/STATE.md
  .kelar/state/PATTERNS.md
  </files_to_read>"""
)
```

If REJECTED → show issues, ask user to adjust, re-plan. Do not execute a rejected plan.

---

## STEP 5: SHOW PLAN & HUMAN GATE

Extract plan summary:
```bash
node .kelar/kelar-tools.cjs plan tasks .kelar/plans/[feature-slug]-plan.xml
```

Present to user:
```
KELAR PLAN READY
────────────────
Feature : [name]
Goal    : [goal]
Waves   : [N] | Tasks: [total]

WAVE 1 — [title] [parallel: ✓/✗]
  ├─ 1.1 [title] → [file]
  └─ 1.2 [title] → [file]

WAVE 2 — [title]
  └─ 2.1 [title] → [file]

Research found:
  ⚠ [key gotcha if any]
  ✓ [key pattern identified]

Plan checked: ✅ APPROVED

Execute? (yes / adjust [what] / no)
```

**STOP. Do not execute until user confirms.**

---

## STEP 6: WAVE EXECUTION

Get wave 1:
```bash
node .kelar/kelar-tools.cjs plan wave .kelar/plans/[feature-slug]-plan.xml 1
```

### Parallel wave execution:

If `parallel: true`, spawn all tasks simultaneously:
```
Task(kelar-executor, task 1.1 XML + files_to_read)
Task(kelar-executor, task 1.2 XML + files_to_read)
Task(kelar-executor, task 1.3 XML + files_to_read)
```

Wait for ALL to complete before proceeding to next wave.

### After each task completes:

```bash
node .kelar/kelar-tools.cjs tasks log done "Task [id]: [title] — [one line result]"
{{COMMIT_BEHAVIOR}}
```

### If a task fails verification → spawn repair:
```
Task(
  subagent_type="general-purpose",
  prompt="""You are kelar-repair. Recover from failed task.
  
  Failed task: [task XML]
  Verifier report: [failure details]
  Repair budget: 2 attempts
  
  <files_to_read>
  [target file]
  .kelar/state/STATE.md
  </files_to_read>"""
)
```

### Wave complete checkpoint:
```bash
node .kelar/kelar-tools.cjs tasks log wave "Wave [N] complete. Tasks: [list]"
```

Present to user:
```
WAVE [N] COMPLETE ✅
────────────────────
  ✅ [task 1.1] — [result]
  ✅ [task 1.2] — [result]

Next: Wave [N+1] — [title]
  [ ] [task list]

Continue? (yes / stop / adjust)
```

Repeat for all waves.

---

## STEP 7: FINAL VERIFICATION

```
Task(
  subagent_type="general-purpose",
  prompt="""You are kelar-verifier. Verify [feature name] implementation.
  
  Goal: [goal from plan]
  
  Check: existence, compilation, tests, goal achievement, scope.
  
  <files_to_read>
  .kelar/plans/[feature-slug]-plan.xml
  [all files modified during execution]
  </files_to_read>"""
)
```

---

## STEP 8: COMPLETE

```bash
node .kelar/kelar-tools.cjs tasks log feature_done "[feature name] — [result summary]"
node .kelar/kelar-tools.cjs state patch "Working on" "nothing"
node .kelar/kelar-tools.cjs handoff write
```

```
KELAR FEATURE COMPLETE ✅
──────────────────────────
Feature  : [name]
Goal     : [achieved ✓]
Tasks    : [N/N complete]
Verified : [PASS / issues noted]
Time     : [wave count] waves

Files modified:
  [list with one-line summary each]

Knowledge saved:
  [any new entries added to .kelar/memory/]
```

{{COMMIT_BEHAVIOR}}
