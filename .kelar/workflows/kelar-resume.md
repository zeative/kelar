---
name: kelar:resume
description: Restore full context and continue exactly where you left off. Uses kelar-tools for fast structured context loading.
allowed-tools:
  - Bash
  - Read
---

# /kelar:resume

{{LANGUAGE}}

```bash
# Load everything at once
HEALTH=$(node .kelar/kelar-tools.cjs health)
HANDOFF=$(node .kelar/kelar-tools.cjs handoff read)
ACTIVE=$(node .kelar/kelar-tools.cjs tasks active)
SNAPSHOT=$(node .kelar/kelar-tools.cjs state snapshot)
PATTERNS_COUNT=$(node .kelar/kelar-tools.cjs patterns list | wc -l)
```

Present resume state:

```
KELAR RESUMED
─────────────
Project  : [from snapshot]
Feature  : [from handoff or active task]
Status   : [active / paused at: X / idle]
Next step: [from active.next_step or handoff.next_step]

Patterns loaded : [N]
Memory entries  : [check INDEX.md line count]
Last activity   : [from handoff.generated]

Proceed with "[next step]"? (yes / new task / status)
```

If HANDOFF not found and ACTIVE is idle:
```
No active session found.

Options:
  A) Start new feature → /kelar:feature [description]
  B) Map codebase first → /kelar:map
  C) Check status → /kelar:status
```

Log resume:
```bash
node .kelar/kelar-tools.cjs tasks log note "SESSION RESUMED — continuing: [next step]"
```
