---
name: safe-execution
description: >
  Provides diff preview and rollback checkpoints before applying significant changes.
  This skill should be used before multi-file changes, refactors, HIGH risk impact radar
  results, operations on core/shared files, or any change that could be hard to reverse.
  Triggers on: multi-file changes, refactors, "update all", core file modifications,
  breaking changes, database migrations.
allowed-tools:
  - Bash
  - Read
---

# Safe Execution: Diff Preview + Rollback

See before you apply. Undo in seconds if needed.

## PHASE 1: ROLLBACK CHECKPOINT

Before ANY significant change:
```bash
git add -A && git stash push -m "kelar-checkpoint-$(date +%Y%m%d-%H%M)-before-[task-slug]"
```

```
KELAR CHECKPOINT CREATED
─────────────────────────
Checkpoint: kelar-checkpoint-[timestamp]-before-[task]
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

Summary: [N] files changed, [+N] added, [-N] removed

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

If type check fails → offer immediate rollback before proceeding.

## /kelar:rollback

```
Available checkpoints:
1. kelar-checkpoint-[timestamp]-before-[task] (most recent)
2. kelar-checkpoint-[timestamp]-before-[task]

Roll back to which? (1 / 2 / cancel)
```

```bash
git stash pop  # restore
```

## ADAPTIVE
Quick task (1 file, small change): skip — just apply and show what changed.
Medium (2-5 files): checkpoint + diff summary + confirmation.
Large/risky (5+ files, core): checkpoint + full diff + require "yes" + type check.
