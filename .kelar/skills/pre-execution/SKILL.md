---
name: pre-execution
description: >
  Activate when user asks to build a feature, implement something, add functionality,
  create a new file, or modify existing code. This skill runs BEFORE any code is written.
  Triggers on: "build", "create", "implement", "add", "make", "write", "update", "change"
---

# KELAR Skill: Pre-Execution Protocol

You must complete ALL phases below before writing a single line of code.

---

## PHASE 1: EXPLORE

Read and understand the codebase context relevant to this task.

**Required reads:**
1. Find 2-3 files most similar to what you're about to create/modify
2. Find the layer where this code belongs (based on architecture)
3. Find existing utilities, helpers, or components you might reuse
4. Check .kelar/state/STATE.md if it exists — understand current project decisions

**Output after Phase 1:**
```
KELAR EXPLORE
─────────────
Files read   : [list]
Patterns found:
  - Structure : [what you observed]
  - Naming    : [what you observed]
  - Error handling: [what you observed]
  - Reusable  : [existing code you can reuse]
```

---

## PHASE 2: UNDERSTAND

Confirm your understanding of the task before planning.

**State clearly:**
- What the user wants to achieve (in your own words)
- What the expected input/output is
- What edge cases need to be handled
- What is explicitly OUT of scope

**Output after Phase 2:**
```
KELAR UNDERSTAND
────────────────
Goal    : [what needs to be built]
Input   : [what goes in]
Output  : [what comes out]
Edges   : [edge cases to handle]
Out of scope: [what you will NOT do]
```

If anything is unclear → ask ONE clarifying question before continuing.

---

## PHASE 3: PLAN

Break the task into micro-tasks. Each micro-task must:
- Touch maximum 1-2 files
- Be completable in one focused action
- Have a clear, verifiable done condition

**Output after Phase 3:**
```
KELAR PLAN
──────────
Task: [overall task name]

Micro-tasks:
[ ] 1. [action] in [file] → done when: [condition]
[ ] 2. [action] in [file] → done when: [condition]
[ ] 3. [action] in [file] → done when: [condition]

Files to modify : [list]
Files to create : [list]
Files untouched : everything else

Approach options:
  A) [approach A] — [tradeoff]
  B) [approach B] — [tradeoff]

Recommended: [A or B] because [reason]
```

---

## PHASE 4: AWAIT APPROVAL

**STOP. Do not write any code yet.**

Present the full plan to the user and wait.

The user may:
- Say "yes" or "ok" → proceed with execution
- Edit the plan → apply their edits, confirm, then proceed
- Say "no" → ask what to change

**Only after explicit approval, begin execution.**

---

## EXECUTION

Once approved, execute micro-tasks in order:
1. Complete micro-task 1 → update .kelar/state/TASKS.md → show result
2. Complete micro-task 2 → update .kelar/state/TASKS.md → show result
3. Continue until all micro-tasks done

After each micro-task, append to .kelar/state/TASKS.md:
```
[x] [timestamp] [micro-task description] — DONE
```

After all micro-tasks complete, run the self-check from code-quality.md rules.
