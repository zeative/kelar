---
name: kelar:status
description: View current progress, what's done, what's next, and any open decisions or deferred observations.
allowed-tools:
  - Read
---

# /kelar:status

Snapshot of where things stand right now.

## READS
`.kelar/state/TASKS.md` + `.kelar/state/STATE.md` + `.kelar/state/HANDOFF.md` (if exists)

## OUTPUT

```
KELAR STATUS
────────────
Working on  : [feature/fix or "nothing active"]
Progress    : [N/total] tasks ([%]%)

COMPLETED
[x] [task 1]
[x] [task 2]

← YOU ARE HERE →
[ ] [current task]

UPCOMING
[ ] [next]
[ ] [after]

OPEN DECISIONS
- [waiting for user input]

NEXT ACTION
→ [exact next step]
```

## KELAR NOTICES (if any in DEBT.md)

```
Deferred observations:
- [file]: [issue] → /kelar:quick [suggested fix]
Address these? (yes/skip)
```
