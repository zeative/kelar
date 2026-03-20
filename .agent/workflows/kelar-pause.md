---
name: kelar:pause
description: Save full session state before stopping work, hitting context limits, or switching models. Writes HANDOFF.md and session diary entry so work can resume exactly where it left off.
allowed-tools:
  - Read
  - Write
  - Bash
---

# /kelar:pause

Save everything before stopping. Zero context lost on resume.

## STEPS

1. Read `.kelar/state/TASKS.md` and `.kelar/state/STATE.md`
2. Identify last completed task and exact next pending task
3. Write `.kelar/state/HANDOFF.md`:

```markdown
# KELAR HANDOFF
Generated: [timestamp]

## Status
Last completed : [micro-task] in [file]
Next task      : [exact next micro-task to execute]
Wave           : [N] of [total]
Progress       : [N/total] tasks complete

## Context
Feature/Fix : [what's being worked on]
Goal        : [one sentence]
Approach    : [chosen approach]

## Files Modified So Far
- [file] — [what changed]

## Files Pending
- [file] — [what needs to happen]

## Open Decisions
- [anything unresolved / waiting for user input]

## How To Resume
1. Read this file
2. Read .kelar/state/STATE.md
3. Run /kelar:resume
```

4. Append to `.kelar/state/DIARY.md`:
```markdown
## [Date] [Time]
Worked on : [feature/fix]
Completed : [bullet list of done tasks]
Decisions : [pattern decisions → PATTERNS.md]
Debt      : [DEBT.md additions]
Next      : [exact next task]
Mood      : [honest codebase assessment]
```

## OUTPUT
```
KELAR PAUSED
────────────
Saved : .kelar/state/HANDOFF.md ✓
Logged: .kelar/state/DIARY.md ✓
Next  : [next task]

Resume with: /kelar:resume
```
