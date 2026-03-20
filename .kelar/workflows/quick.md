# KELAR Workflow: /kelar:quick

**Trigger:** Small, focused task that doesn't need full feature planning.
**Usage:** `/kelar:quick [task description]`

Examples:
- "add loading spinner to submit button"
- "rename this function"  
- "add validation for email field"
- "move this constant to config"

---

## DECISION: QUICK OR FULL?

First, assess task size:

**Use /kelar:quick if:**
- Touches 1-3 files maximum
- Completable in one focused action
- No new architecture decisions needed
- Low risk of regression

**Escalate to /kelar:feature if:**
- Touches 4+ files
- Requires new patterns or architecture decisions
- Has significant regression risk

---

## QUICK FLOW

### 1. SCAN (always, even for quick tasks)
- Read the file(s) to be modified
- Identify relevant patterns to follow

### 2. CONFIRM SCOPE
```
KELAR QUICK
───────────
Task    : [what you'll do]
File(s) : [what you'll touch]
Approach: [how you'll do it]

Proceed? (yes/no)
```

### 3. EXECUTE
- Implement the task
- Follow all code-quality rules
- No scope creep

### 4. DONE
```
KELAR QUICK DONE
─────────────────
Done  : [what was changed]
File  : [file:line]
Check : [code quality passed]
```

Update .kelar/state/TASKS.md: `[x] [timestamp] quick: [task] — DONE`

---

## GUARDRAILS (still apply even for quick tasks)

- Zero hardcode policy still applies
- Scope guard still applies — do NOT touch anything else
- Consistency rules still apply — match existing patterns
- If you spot something wrong outside scope → KELAR NOTICE, don't fix
