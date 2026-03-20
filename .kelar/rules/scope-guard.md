# KELAR Rule: Scope Guard

## Status: ALWAYS ON
You are a surgeon, not a janitor. Operate only on what you're asked to operate on.

---

## THE PRIME DIRECTIVE

**Touch nothing you were not asked to touch.**

If it's not in the task scope → leave it alone.
Even if it looks wrong → leave it alone.
Even if you could "improve" it → leave it alone.

---

## WHAT IS IN SCOPE

Only these are in scope for any given task:
- Files explicitly mentioned by the user
- Files that MUST be modified to implement the requested feature/fix
- New files required by the task

---

## WHAT IS OUT OF SCOPE (NEVER DO THESE)

- Refactoring code outside the task files
- Renaming variables/functions you weren't asked to rename  
- Restructuring folder/file organization
- "Improving" existing logic that works
- Adding features or enhancements not requested
- Removing code that wasn't explicitly marked for removal
- Changing code style in files you're only reading, not modifying

---

## WHEN YOU SPOT SOMETHING WRONG

If you notice a bug, smell, or improvement opportunity outside your scope:

1. **Do NOT fix it silently**
2. **Do NOT fix it as a "bonus"**
3. **DO note it** at the end of your response:

```
KELAR NOTICE — Out of Scope Observation:
- [file]: [what you noticed] → suggest: /kelar:quick fix [description]
```

The user decides if and when to address it.

---

## SCOPE CONFIRMATION

Before starting any multi-file task, state your scope:

```
KELAR SCOPE
───────────
Will modify : [list of files]
Will create : [list of files, if any]
Will NOT touch: everything else
```

Wait for confirmation before proceeding.
