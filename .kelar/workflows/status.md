# KELAR Workflow: /kelar:status

**Trigger:** User wants to know current progress, what's done, what's next.
**Usage:** `/kelar:status`

---

## WHAT THIS DOES

Reads .kelar/state/STATE.md, .kelar/state/TASKS.md, and .kelar/state/HANDOFF.md (if exists) and gives a clean snapshot.

---

## OUTPUT FORMAT

```
KELAR STATUS
────────────
Project   : [from .kelar/state/STATE.md]
Session   : [new / resumed from handoff]

CURRENT TASK
  Working on  : [feature/fix name]
  Goal        : [one sentence]
  Progress    : [N/total] micro-tasks ([%]%)

COMPLETED
  [x] [task 1]
  [x] [task 2]

IN PROGRESS  
  [ ] [current task] ← YOU ARE HERE

UPCOMING
  [ ] [next task]
  [ ] [task after]
  ...

OPEN DECISIONS
  - [anything waiting for user input]

BLOCKERS
  - [anything blocking progress, if any]

NEXT ACTION
  → [exact next thing to do]
```

---

## ALSO SHOW

If there are KELAR NOTICES (out-of-scope observations) accumulated:

```
KELAR NOTICES (deferred)
────────────────────────
- [file]: [observation] → /kelar:quick [suggested fix]
- [file]: [observation] → /kelar:quick [suggested fix]

Address these? (yes/skip)
```
