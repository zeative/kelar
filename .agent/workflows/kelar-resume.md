---
name: kelar:resume
description: Restore full context from last checkpoint and continue work exactly where it left off. Works across sessions, model switches, and context resets.
allowed-tools:
  - Read
  - Bash
---

# /kelar:resume

Pick up exactly where you left off. Any session, any model.

## STEPS

1. Read `.kelar/state/HANDOFF.md`
2. Read `.kelar/state/STATE.md`
3. Read `.kelar/state/TASKS.md`

## OUTPUT
```
KELAR RESUMED
─────────────
Working on : [feature/fix from HANDOFF]
Progress   : [N/total] tasks complete
Last done  : [last completed task]
Up next    : [exact next task]
Open items : [unresolved decisions, if any]

Proceed with: "[next task]"? (yes/no)
```

**Wait for confirmation before executing anything.**

## IF HANDOFF.md MISSING
Check STATE.md and TASKS.md directly.
If neither exists → ask: "What were we working on? I'll reconstruct the context."
