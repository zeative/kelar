---
name: execution-efficiency
description: >
  Optimizes execution by preferring CLI commands and scripts over manual file
  editing. Activate when a task involves repetitive changes across multiple files,
  batch operations, or any task touching 4+ files with the same pattern.
  Triggers on: "rename all", "replace across", "add to all", "generate",
  "scaffold", "migrate", "update all", any task touching 4+ files identically.
allowed-tools:
  - Bash
  - Write
  - Read
  - Glob
  - Grep
---

# Execution Efficiency: CLI-First, Script-First

A senior developer doesn't edit 20 files manually. They write a script.

## DECISION TREE

Can this be done more efficiently with CLI or script than manual editing?
- YES → write script/command first, execute, verify
- NO  → proceed with manual implementation

Signals a script is better:
- Same change in 3+ files
- Pattern-based transformation (rename, wrap, add import)
- Boilerplate generation (new module, CRUD, component)

## SCALE TABLE

| Files | Approach |
|-------|----------|
| 1-3, unique changes | Manual edit |
| 3-10, same pattern | CLI one-liner |
| 10+, complex pattern | Generated script (JS/Python/Bash) |
| Recurring task | Code generator — invest once, reuse forever |

## CLI EXAMPLES

```bash
# Replace across TypeScript files
find src/ -name "*.ts" -exec sed -i 's/oldName/newName/g' {} +

# Find all usages
grep -rn "functionName(" src/ --include="*.ts"

# Check for hardcoded values
grep -rn "localhost\|127\.0\.0\|hardcoded" src/ --include="*.ts"
```

## EXECUTION FORMAT

```
KELAR EFFICIENCY MODE
─────────────────────
Task    : [description]
Approach: CLI / Script / Generator
Affects : ~[N] files

[script/command preview]

Execute? (yes / review first / no)
```

After execution — always verify:
```bash
node .kelar/kelar-tools.cjs git changed
```

## SCRIPT STORAGE
All generated scripts → `.kelar/scripts/[date]-[action].js`
Keep them — they're documentation of what was done.
