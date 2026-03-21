---
name: safe-execution
description: >
  Provides diff preview and rollback checkpoints before applying significant
  changes. Activate before multi-file changes, refactors, HIGH risk impact radar
  results, or operations on core/shared files.
  Triggers on: multi-file changes, refactors, "update all", core file modifications.
allowed-tools:
  - Bash
  - Read
---

# Safe Execution: Diff Preview + Rollback

See before you apply. Undo in seconds if needed.

## PHASE 1: ROLLBACK CHECKPOINT

Before ANY significant change:
```bash
node .kelar/kelar-tools.cjs git checkpoint
```

```
KELAR CHECKPOINT CREATED
─────────────────────────
Checkpoint: kelar-checkpoint-[timestamp]
Rollback  : git stash pop
```

## PHASE 2: DIFF PREVIEW

Show diff BEFORE applying:

```
KELAR DIFF PREVIEW
──────────────────
File: src/services/UserService.ts
- [old line]
+ [new line]

Summary: [N] files, [+N] added, [-N] removed

Apply? (yes / edit / no)
```

**Wait for explicit approval before writing to disk.**

## PHASE 3: APPLY + VERIFY

After approval:
1. Apply changes
2. Quick sanity check:
```bash
npx tsc --noEmit 2>&1 | head -20
```

```
KELAR APPLIED
─────────────
Applied    : ✓
Type check : PASSED / FAILED — [errors]
```

If type check fails → offer immediate rollback:
```bash
node .kelar/kelar-tools.cjs git checkpoint  # already done in phase 1
# rollback: git stash pop
```

## ADAPTIVE
Quick task (1 file, small): skip — just apply and show what changed.
Medium (2-5 files): checkpoint + diff summary + confirmation.
Large/risky (5+ files, core): checkpoint + full diff + require "yes" + type check.
