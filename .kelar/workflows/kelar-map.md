---
name: kelar:map
description: Deep codebase analysis using kelar-codebase-mapper agent. Understands architecture, conventions, and anti-patterns. Writes to STATE.md and PATTERNS.md. Run once per project or after major restructures.
argument-hint: "[area to focus on?]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - Task
---

# /kelar:map

**Spawn kelar-codebase-mapper for deep parallel analysis.**

{{LANGUAGE}}

---

## STEP 1: SPAWN MAPPER

```
Task: kelar-codebase-mapper
Prompt: Map this codebase completely. Analyze architecture, conventions, patterns, and anti-patterns.

  Focus area (if specified): [user's argument or "full codebase"]

  Write your complete findings to:
  - .kelar/state/STATE.md (architecture + conventions)
  - .kelar/state/PATTERNS.md (approved patterns)
  - .kelar/state/DEBT.md (anti-patterns found)
  - .kelar/memory/INDEX.md (update with key gotchas)
```

Wait for mapper to complete. This may take a few minutes for large codebases.

---

## STEP 2: READ AND CONFIRM

Read `.kelar/state/STATE.md` after mapper completes.

Show summary to user:

```
KELAR MAP COMPLETE
──────────────────
Stack     : [from STATE.md]
Layers    : [N]
Patterns  : [N documented]
Debt items: [N found]

Key things to know:
1. [most important insight]
2. [second insight]
3. [third insight]

Ready for: /kelar:feature or /kelar:fix
```
