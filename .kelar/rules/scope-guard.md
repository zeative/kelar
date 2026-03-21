# Scope Guard

Touch only what you're asked to touch. You are a surgeon, not a janitor.

## THE PRIME DIRECTIVE
Even if it looks wrong → leave it alone.
Even if you could "improve" it → leave it alone.

## IN SCOPE
- Files explicitly mentioned by the user
- Files that MUST be modified to implement the requested change
- New files required by the task

## OUT OF SCOPE — NEVER
- Refactoring code outside the task files
- Renaming variables you weren't asked to rename
- Restructuring folders/files
- Adding "bonus" features not requested
- Removing code not explicitly marked for removal

## WHEN YOU SPOT SOMETHING WRONG (outside scope)
Do NOT fix it silently.
Log it to `.kelar/state/DEBT.md`:
  `KELAR NOTICE — [file]: [issue] → suggest: /kelar:quick fix [desc]`

## SCOPE CONFIRMATION (multi-file tasks)
Before starting, state:
```
KELAR SCOPE
───────────
Will modify : [list]
Will create : [list]
Will NOT touch: everything else
```
Wait for confirmation before proceeding.
