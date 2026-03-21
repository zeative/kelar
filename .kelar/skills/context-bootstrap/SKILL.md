---
name: context-bootstrap
description: >
  Loads all project context at the start of every session. ALWAYS activate
  at session start before any other action. Prevents the AI from working blind.
  Triggers on: session start, "let's continue", "resume", "where were we",
  any first message in a conversation about a project.
allowed-tools:
  - Read
  - Bash
---

# Context Bootstrap

**Working without context is working blind. Load context first. Always.**

A session without context loading is like a surgeon who didn't read the patient's chart.

---

## STEP 1: LOAD PROJECT STATE

```
Reading .kelar/state/STATE.md    ... [exists / not found]
Reading .kelar/state/PATTERNS.md ... [exists / not found]  
Reading .kelar/state/TASKS.md    ... [exists / not found]
Reading .kelar/state/ASSUMPTIONS.md [exists / not found]
Reading .kelar/state/HANDOFF.md  ... [exists / not found]
```

If files don't exist → run `/kelar:map` first.

---

## STEP 2: DECLARE LOADED STATE

```
KELAR CONTEXT LOADED
─────────────────────
Project type  : [from STATE.md]
Stack         : [from STATE.md]
Conventions   : [key patterns on file]
Active task   : [from TASKS.md — current task or "none"]
Patterns      : [N approved patterns loaded]
Assumptions   : [N unverified / N verified]
Pending debt  : [N items in DEBT.md]
Last session  : [from DIARY.md — what was worked on]
```

---

## STEP 3: SURFACE BLOCKERS

If any of these exist, surface them BEFORE doing anything else:

### Unverified assumptions:
```
KELAR ASSUMPTION CHECK
──────────────────────
⚠️  [N] unverified assumption(s):

1. "[assumption text]" — assumed [date]
   Still accurate? (yes / [correction] / skip)
```

### Pending high-priority debt:
```
🔴 HIGH PRIORITY DEBT:
- [file]: [issue]
Address before starting? (yes/no)
```

---

## STEP 4: ORIENT TO TASK

If there's an active task (from HANDOFF.md or TASKS.md):

```
KELAR SESSION ORIENTATION
──────────────────────────
Working on  : [feature/fix name]
Progress    : [N/total] tasks complete
Last done   : [last completed micro-task]
Up next     : [exact next micro-task]

Continue with this? (yes / [new task])
```

If no active task → wait for user instruction.

---

## WHAT THIS PREVENTS

Without context bootstrap, AI agents commonly:
- Re-ask questions that were already answered in previous sessions
- Use patterns inconsistent with the codebase (because they didn't check)
- Re-do work that was already completed
- Miss critical assumptions that would break their approach
- Ignore pending debt that could affect current task

Context bootstrap costs 30 seconds. It prevents hours of rework.

---

## FAILURE MODE: STATE FILES DON'T EXIST

If `.kelar/state/` is empty or missing:
```
KELAR COLD START
────────────────
No state files found.

This means either:
  A) This is a new project — run /kelar:map to generate initial state
  B) State files were deleted — this is a problem, check git history
  C) Working in a new directory — confirm correct project directory

Which is it?
```

Do not proceed without answering this. Working without project context guarantees inconsistent output.
