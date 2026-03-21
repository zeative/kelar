---
name: activity-tracker
description: >
  Tracks everything the AI does and plans to do across sessions. ALWAYS active.
  Writes structured logs that allow any AI session to resume with full context.
  Triggers on: every task start, every step completion, every session end.
  Critical for: /kelar:resume, /kelar:status, and cross-session continuity.
allowed-tools:
  - Read
  - Write
  - Bash
---

# Activity Tracker

**Every action logged. Nothing lost between sessions.**

If you don't log it, it didn't happen. The next session starts blind.

---

## MANDATORY LOG FORMAT

All entries go to `.kelar/state/TASKS.md`. Never delete entries — append only.

### Task Start
```
## [YYYY-MM-DD HH:MM] TASK STARTED
Task    : [task name — specific, not vague]
Type    : feature | fix | quick | refactor | research
Scope   :
  Modify: [file1, file2]
  Create: [file3]
  Read  : [file4 — for context only]
Approach: [one sentence — what strategy]
Plan    :
  [ ] Step 1: [action] → done when: [condition]
  [ ] Step 2: [action] → done when: [condition]
  [ ] Step 3: [action] → done when: [condition]
Est.    : tiny (< 15min) | small (15-45min) | medium (1-2hr) | large (2hr+)
```

### Step Completion
```
[HH:MM] ✓ Step [N]: [what was done] — [file:line if relevant]
```

### Task Completion
```
## [YYYY-MM-DD HH:MM] TASK COMPLETE ✓
Task    : [task name]
Results :
  - Created: [files]
  - Modified: [files with one-line summary]
  - Result: [what user can now do]
Quality : [gates passed | issues found]
Decisions: [any architectural choices made → also write to PATTERNS.md]
Debt     : [anything noticed but not fixed → also write to DEBT.md]
Next     : [recommended next action]
```

### Mid-Task Pause
```
## [YYYY-MM-DD HH:MM] PAUSED ⏸
Task    : [task name]
Progress: [N/N steps complete]
Stopped at: [EXACT point — which file, which function, which line]
Next step : [EXACT description of what to do when resuming]
Context   : [any important context needed to resume correctly]
Blockers  : [anything blocking progress, if any]
Resume with: /kelar:resume
```

### Observation (out of scope)
```
[HH:MM] 🔍 NOTICED: [file] — [issue] → logged to DEBT.md
```

---

## SESSION START PROTOCOL

At the beginning of every session, run this sequence:

**Step 1** — Load all state files:
```bash
cat .kelar/state/HANDOFF.md 2>/dev/null || echo "No handoff file"
cat .kelar/state/TASKS.md 2>/dev/null | tail -50 || echo "No tasks file"  
cat .kelar/state/PATTERNS.md 2>/dev/null || echo "No patterns file"
```

**Step 2** — Declare what was loaded:
```
KELAR SESSION RESUMED
─────────────────────
Last activity : [date/time from TASKS.md]
Last task     : [task name]
Status        : [complete / paused at: X]
Patterns      : [N loaded]
Active debt   : [N items]

Up next: [exact next step if paused, or "awaiting instruction" if complete]
```

**Step 3** — Ask before doing anything:
> "Shall I continue with [next task], or do you have a new task?"

---

## SESSION END PROTOCOL

When stopping work (user says goodbye, context limit approaching, or /kelar:pause called):

**Step 1** — Write PAUSED entry to TASKS.md

**Step 2** — Write/update HANDOFF.md:
```markdown
# KELAR HANDOFF
Generated: [timestamp]

## Last Task
Name      : [task]
Status    : [complete / paused]
Stopped at: [exact point if paused]
Next step : [exact next action]

## Active Context
Feature   : [what's being built]
Approach  : [chosen strategy]
Key decisions: [any choices made this session]

## Files Changed This Session
- [file] — [what changed]

## Files Pending
- [file] — [what needs to happen]

## Unresolved Questions
- [anything waiting for user input]

## Quick Resume
1. Read this file
2. Read .kelar/state/TASKS.md (last 20 lines)
3. Run /kelar:resume
```

**Step 3** — Append to DIARY.md:
```markdown
## [Date] [Time]
Worked on : [feature/fix]
Completed : [what was done]
Decisions : [architectural choices]
Debt      : [what was noticed]
Next      : [exact next step]
```

---

## TASK INDEX — KEEP THIS UPDATED

At the top of TASKS.md, maintain a living index:

```markdown
# KELAR Tasks
Last updated: [timestamp]

## 🔄 ACTIVE
[task name] — started [date] — [N/N steps] — paused at: [step]

## ✅ COMPLETED (recent)
[task name] — [date] — [one-line summary]
[task name] — [date] — [one-line summary]

## 📋 QUEUED (not started)
[task name] — [priority: high/medium/low]

## ⏭ MICRO-TASKS (in progress)
[ ] [step] → done when: [condition]
[x] [step] — DONE [timestamp]
```

---

## CONTINUITY RULES

1. **Log before doing** — Write the STARTED entry before the first line of code
2. **Log after each step** — Don't batch logs; write as you go
3. **Log on interruption** — If anything stops you, write PAUSED immediately
4. **Never truncate** — TASKS.md is append-only. Old entries stay forever
5. **Cross-reference** — Patterns go to PATTERNS.md AND mentioned in TASKS.md
6. **Be specific** — "Added getUserById to UserService.ts:45" not "added function"

---

## FAILURE MODE: TASKS.md MISSING OR CORRUPT

If TASKS.md doesn't exist or is unreadable:
```
KELAR COLD START DETECTED
──────────────────────────
No task history found.

Creating fresh TASKS.md...
[create the file with today's date and current task]

Continuing with: [current task]
```

Do not halt. Create the file and proceed. But flag it to the user.
