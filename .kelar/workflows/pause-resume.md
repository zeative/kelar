# KELAR Workflow: /kelar:pause & /kelar:resume

---

# /kelar:pause

**Trigger:** User is stopping work, hitting context limit, or switching sessions.
**Usage:** `/kelar:pause`

## What This Does

Writes a complete handoff snapshot so any session (even with a weaker model) can continue exactly where you left off.

## PAUSE STEPS

1. Read current .kelar/state/TASKS.md
2. Read current .kelar/state/STATE.md  
3. Identify: what was the last completed micro-task?
4. Identify: what is the NEXT micro-task to execute?
5. Identify: any blockers or open decisions?

Write .kelar/state/HANDOFF.md:

```markdown
# KELAR HANDOFF
Generated: [timestamp]

## Status
Last completed : [micro-task description] in [file]
Next task      : [exact next micro-task to execute]
Current wave   : Wave [N] of [total waves]
Overall progress: [N/total] micro-tasks complete

## Active Context
Feature/Fix  : [what's being worked on]
Goal         : [one sentence goal]
Approach     : [chosen approach from options]

## Files Modified So Far
- [file] — [what was changed]
- [file] — [what was changed]

## Files To Be Modified Next
- [file] — [what needs to happen]

## Open Decisions
- [anything that was asked but not yet answered]
- [any ambiguity that needs resolution]

## How To Resume
1. Read .kelar/state/HANDOFF.md (this file)
2. Read .kelar/state/STATE.md for full project context
3. Read .kelar/state/TASKS.md for full task list
4. Run: /kelar:resume
```

5. Write session diary entry to .kelar/state/DIARY.md:
```markdown
## [Date] [Time] — Session #[N]

**Worked on:** [feature/fix name]
**Completed:** [bullet list of completed micro-tasks]
**Decisions:** [any pattern decisions logged to .kelar/state/PATTERNS.md]
**Assumptions:** [any new assumptions logged to .kelar/state/ASSUMPTIONS.md]
**Debt logged:** [any new items added to .kelar/state/DEBT.md]
**Blockers:** [anything unresolved]
**Next session:** [exact next micro-task]
**Mood:** [honest codebase assessment]
```

Output to user:
```
KELAR PAUSED
────────────
Progress saved : .kelar/state/HANDOFF.md
Session logged : .kelar/state/DIARY.md
Last task      : [task]
Next task      : [task]

To continue in a new session: /kelar:resume
```

---

# /kelar:resume

**Trigger:** Starting a new session, switching models, or returning after a break.
**Usage:** `/kelar:resume`

## RESUME STEPS

1. Read .kelar/state/HANDOFF.md
2. Read .kelar/state/STATE.md
3. Read .kelar/state/TASKS.md
4. Confirm understanding to user

Output:
```
KELAR RESUMED
─────────────
Project   : [project name from .kelar/state/STATE.md]
Working on: [feature/fix name]
Progress  : [N/total] micro-tasks complete

Last done : [last completed task]
Up next   : [next task to execute]
Open items: [any open decisions]

Ready to continue. Shall I proceed with: [next task]?
```

**Wait for user confirmation before executing anything.**

## IF .kelar/state/HANDOFF.md DOESN'T EXIST

Check .kelar/state/STATE.md and .kelar/state/TASKS.md directly.
If neither exists → ask user: "What were we working on? I'll reconstruct the context."
