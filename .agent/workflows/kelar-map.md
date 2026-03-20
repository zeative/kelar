---
name: kelar:map
description: Scan and understand an existing codebase before starting any work. Writes architecture map to .kelar/state/STATE.md.
argument-hint: "[area?]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Write
---

# /kelar:map

Analyze the codebase before any work begins. Run this once per project.

## STEPS

1. Read top-level folder structure
2. Identify layers (routes → controllers → services → repositories)
3. Find 3-5 representative files per layer
4. Extract: naming conventions, import/export patterns, error handling, async pattern
5. If frontend exists: find design tokens, component library, state management
6. Identify entry points and config files

## OUTPUT → `.kelar/state/STATE.md`

```markdown
# Project State
Last mapped: [timestamp]

## Architecture
Type : [fullstack/backend/frontend/CLI]
Stack: [technologies]
Layers:
  [layer] → [folder] → [responsibility]

## Conventions
Naming    : [patterns]
Async     : [pattern]
Errors    : [pattern]
Exports   : [pattern]
UI Tokens : [if applicable]

## Key Files
[file] — [why important]

## Anti-Patterns Found
[pattern] — reason: [why to avoid]
```

## OUTPUT TO USER

```
KELAR MAP COMPLETE
──────────────────
Stack   : [stack]
Layers  : [N]
Patterns: [N documented]
Issues  : [N anti-patterns noted]

Ready for: /kelar:feature or /kelar:fix
```
