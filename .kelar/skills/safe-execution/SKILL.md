---
name: safe-execution
description: >
  Activate before applying any multi-file change, refactor, or operation that could
  be hard to reverse. Provides diff preview before apply and creates rollback checkpoints.
  Triggers on: multi-file changes, refactors, "update all", any HIGH risk impact radar result,
  operations on core/shared files, database migrations.
---

# KELAR Skill: Diff Preview + Rollback Checkpoint

See before you apply. Undo in seconds if needed.

---

## PHASE 1: ROLLBACK CHECKPOINT

Before ANY significant change, create a named checkpoint:

```bash
# Create named checkpoint
git add -A && git stash push -m "kelar-checkpoint-[timestamp]-before-[task-slug]"

# Or if already committed work you want to keep:
git tag kelar-checkpoint-[timestamp]-before-[task-slug]
```

Output:
```
KELAR CHECKPOINT CREATED
─────────────────────────
Checkpoint: kelar-checkpoint-[timestamp]-before-[task]
Rollback  : /kelar:rollback (or: git stash pop)
```

---

## PHASE 2: DIFF PREVIEW

For file edits — show the diff BEFORE applying:

```
KELAR DIFF PREVIEW
──────────────────
File: src/services/UserService.ts

  async getUser(id: string) {
-   return db.query(`SELECT * FROM users WHERE id = ${id}`)
+   return db.users.findUnique({ where: { id } })
  }

File: src/controllers/UserController.ts

+ import { validateId } from '@/utils/validate'
  
  async handleGet(req, res) {
+   validateId(req.params.id)
    const user = await userService.getUser(req.params.id)

Summary:
  Files changed: 2
  Lines added  : 3
  Lines removed: 1
  
Apply these changes? (yes / edit / no)
```

**Wait for explicit approval before writing to disk.**

---

## PHASE 3: APPLY

After approval:
1. Apply changes
2. Immediately run quick sanity check:

```bash
# TypeScript — check for type errors
npx tsc --noEmit 2>&1 | head -20

# JavaScript — check for syntax errors  
node --check src/[changed-file].js
```

Output:
```
KELAR APPLIED
─────────────
Changes applied: ✓
Type check     : PASSED / FAILED — [errors]
```

If type check fails → offer immediate rollback before proceeding.

---

## ROLLBACK COMMAND: /kelar:rollback

```
KELAR ROLLBACK
──────────────
Available checkpoints:
  1. kelar-checkpoint-[timestamp]-before-[task] (most recent)
  2. kelar-checkpoint-[timestamp]-before-[task]
  3. [git tags if any]

Roll back to which? (1 / 2 / cancel)
```

After selection:
```bash
git stash pop  # for stash-based checkpoint
# or
git checkout kelar-checkpoint-[timestamp]  # for tag-based
```

---

## ADAPTIVE BEHAVIOR

**Quick task (1 file, small change):**
- Skip checkpoint (overkill)
- Skip diff preview — just apply and show what changed after

**Medium task (2-5 files):**
- Create checkpoint
- Show diff summary (file names + line counts)
- Apply after confirmation

**Large/risky task (5+ files, core files, breaking changes):**
- Create checkpoint
- Show full diff with context
- Require explicit "yes" to apply
- Run type check after apply
- Keep checkpoint until next session confirms everything works
