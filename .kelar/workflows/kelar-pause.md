---
name: kelar:pause
description: Save complete session state before stopping. Writes HANDOFF.md and diary using kelar-tools.
allowed-tools:
  - Bash
  - Read
---

# /kelar:pause

{{LANGUAGE}}

```bash
# Commit any uncommitted work first
node .kelar/kelar-tools.cjs git status

# Write complete handoff
node .kelar/kelar-tools.cjs handoff write

# End session (writes diary entry)
node .kelar/kelar-tools.cjs session end
```

Show confirmation:

```
KELAR PAUSED ⏸
──────────────
Handoff  : .kelar/state/HANDOFF.md ✓
Diary    : .kelar/state/DIARY.md ✓
Next step: [from handoff]

Resume with: /kelar:resume
```
