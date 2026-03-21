---
name: deep-debug
description: >
  Handles systematic debugging with root cause analysis. Activate when user
  reports an error, bug, unexpected behavior, or asks to fix something broken.
  Always trace to root cause — never patch symptoms.
  Triggers on: "error", "bug", "broken", "fix", "not working", "fails", "crash",
  "wrong output", "exception", "undefined", "null", "TypeError", "not expected",
  "should be", "instead it", "weird behavior"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
---

# Deep Debug Protocol

**Symptoms are clues, not answers. Find the disease, not just the rash.**

A null check that silences an error is not a fix. It is a cover-up.
A try-catch that swallows an exception is not error handling. It is hiding a bug.
You will find the ROOT CAUSE and fix THAT — nothing else.

---

## PHASE 1: INTAKE — GET THE COMPLETE PICTURE

Never start debugging without the full error. Never.

```
KELAR DEBUG INTAKE
──────────────────
Error message  : [exact text — copy-paste, not paraphrase]
Stack trace    : [full trace — every line matters]
Trigger        : [exact steps to reproduce]
Expected       : [what SHOULD happen]
Actual         : [what ACTUALLY happens]
Frequency      : [always / sometimes / first time / after X]
Recent changes : [what changed before this started?]
Environment    : [dev / prod / specific OS / specific browser?]
```

### If stack trace is missing:
> "I need the full stack trace to debug this effectively. Can you run the command again and paste the complete error output? Including the part before 'at [file]'."

**Do not guess without a stack trace. Ever.**

### How to read a stack trace:
```
Error: Cannot read property 'id' of undefined    ← ERROR TYPE + MESSAGE
  at getUserName (src/utils/user.ts:24:18)        ← LINE WHERE IT EXPLODED (start here)
  at formatProfile (src/services/profile.ts:67:5) ← WHO CALLED IT
  at ProfileController.get (src/routes/profile.ts:15:10) ← WHO CALLED THAT
  at Layer.handle (node_modules/express/...)       ← FRAMEWORK (usually ignore)
```

Read from TOP (where it exploded) DOWN (what called it).
The top tells you WHERE. The chain tells you WHY.

---

## PHASE 2: TRACE — MINIMUM 3 LEVELS DEEP

Never stop at the surface. The surface is where the error shows up.
The root is where the wrong thing is created.

### Level 1 — Surface (where the error shows)
```bash
# Open the file at the exact line
# Read the function — understand what it ASSUMES
```
Question to answer: What does this code expect that it's not getting?

### Level 2 — Caller (who called the broken code)
```bash
grep -r "functionName(" src/ --include="*.ts" --include="*.tsx" -n
```
Question to answer: What does the caller PASS to this function? Is it correct?

### Level 3 — Origin (where the bad data/state comes from)
```bash
# Follow the data — where does it come from?
# API call? Database? User input? State? Props?
```
Question to answer: Where is the bad value created? When does it become wrong?

### Level 4+ — If root isn't clear yet
Keep going. Common root cause locations:
- State management (Redux store, useState, context)
- API response parsing
- Database query result
- Environment configuration
- Race condition (async timing)
- Type coercion (JavaScript implicit conversion)

```
KELAR TRACE
───────────
Level 1 — Surface : [file:line] — [what it assumes, what it gets]
Level 2 — Caller  : [file:line] — [what it passes, where from]
Level 3 — Origin  : [file:line] — [where bad data is born]
Level 4+          : [if needed]

Error type: 
  [ ] data — wrong/missing/null value
  [ ] logic — correct data, wrong computation
  [ ] integration — correct code, wrong interaction between components
  [ ] race condition — timing/async issue
  [ ] config — environment/setup problem
  [ ] type — TypeScript/runtime type mismatch
```

---

## PHASE 3: ROOT CAUSE STATEMENT

Before touching any code, state the root cause in ONE sentence.

```
KELAR ROOT CAUSE
────────────────
Root cause   : [ONE sentence — exactly what is wrong]
Mechanism    : [why this causes the error we see]
Why not caught: [what validation/guard is missing that would have caught this]
Reproduces   : [minimum steps to reproduce]
```

### Examples of good root cause statements:

✓ "The `getUserById` function returns `null` when user is not found, but `formatProfile` on line 67 dereferences it without a null check."

✓ "The API response uses `snake_case` keys (`user_id`) but the frontend expects `camelCase` (`userId`), causing undefined when mapping."

✓ "The `useEffect` fetches data but the dependency array is empty `[]`, so it never re-fetches when `userId` prop changes."

### Examples of bad root cause statements:

❌ "There's a null pointer exception" — this is the symptom, not the cause

❌ "The function doesn't handle the error properly" — too vague

❌ "Something goes wrong when calling the API" — you haven't traced deep enough

**If you cannot write a clear one-sentence root cause → you are not done tracing. Keep going.**

### Uncertain? State TWO hypotheses:
```
KELAR HYPOTHESES
────────────────
Hypothesis A : [root cause candidate 1]
  Evidence for: [what supports this]
  Verify by   : [exact command or check]

Hypothesis B : [root cause candidate 2]
  Evidence for: [what supports this]
  Verify by   : [exact command or check]

I'll verify A first because: [reason]
```

---

## PHASE 4: BLAST RADIUS

Before fixing anything, understand what else could break.

```bash
# Find everything that uses the broken code
grep -r "functionName\|ClassName\|the-bug-location" src/ --include="*.ts" --include="*.tsx" -l
```

```
KELAR IMPACT
────────────
Root cause location: [file:line]
Direct dependents  :
  - [file] uses [what] → impact: breaking / non-breaking / unknown
  - [file] uses [what] → impact: breaking / non-breaking / unknown

Same bug pattern exists in: [other files with same issue / "not found"]
Risk level: LOW / MEDIUM / HIGH

LOW    = only the one file, no dependents affected
MEDIUM = 2-4 dependents, non-breaking changes possible
HIGH   = 5+ dependents OR breaking API changes OR core business logic
```

**HIGH risk → show impact to user, require explicit approval before proceeding.**

---

## PHASE 5: FIX OPTIONS — ALWAYS PRESENT 2-3

Never present a single solution. Present the tradeoffs and let the human decide.

```
KELAR FIX OPTIONS
─────────────────
Option A: [name]
  What    : [specific change]
  Where   : [file:line]
  Pros    : [benefits]
  Cons    : [drawbacks]
  Risk    : LOW / MEDIUM / HIGH
  
Option B: [name]
  What    : [specific change]
  Where   : [file:line]
  Pros    : [benefits]
  Cons    : [drawbacks]
  Risk    : LOW / MEDIUM / HIGH

Option C: [name — often the "proper long-term fix"]
  What    : [specific change]
  Where   : [file:line]
  Pros    : [benefits]
  Cons    : [may take longer]
  Risk    : LOW / MEDIUM / HIGH

Recommended: [A/B/C] because [concrete technical reason]
```

### Example fix options for a null reference error:

Option A — Null guard (quick):
```typescript
// Add null check at the point of use
if (!user) return null;
```
Pros: 2-line fix, zero risk | Cons: Doesn't fix WHY user is null

Option B — Fix the source (correct):
```typescript
// In getUserById, throw instead of returning null
if (!user) throw new NotFoundError(`User ${id} not found`);
```
Pros: Correct behavior, callers know it failed | Cons: Must update callers to handle error

Option C — Type system enforcement (proper):
```typescript
// Make the return type explicit so TypeScript catches this at compile time
async function getUserById(id: string): Promise<User> { // not Promise<User | null>
```
Pros: Prevents entire class of bugs | Cons: Requires updating all callers

**STOP. Wait for user to choose. Do not implement yet.**

---

## PHASE 6: APPLY FIX + VERIFY ROOT CAUSE ADDRESSED

After user chooses:

**6.1** Apply ONLY the chosen fix. No extra changes.

**6.2** Verify the root cause is actually addressed:
```
KELAR FIX VERIFICATION
──────────────────────
Root cause was  : [the one-sentence statement from Phase 3]
Fix addresses it: YES / PARTIALLY / NO

YES means:
  [ ] The specific wrong thing is now correct
  [ ] The code path that created bad data is fixed
  [ ] The missing validation is in place
  
PARTIALLY means: (do not close until fully fixed)
  [ ] Only the symptom is masked — root cause still exists

Evidence fix works:
  [ ] [specific test case or manual check]
  [ ] [edge case that was failing now passes]
```

**6.3** Check if same bug exists elsewhere:
```bash
grep -r "same pattern" src/ --include="*.ts" -n
```

If found → log to DEBT.md. Do not fix silently (scope guard applies).

**6.4** Update `.kelar/state/STATE.md`:
```markdown
## Fix: [Error summary] — [date]
- Root cause : [one sentence]
- Fixed in   : [file:line]
- Approach   : [which option, why]
- Regression : none / [what to watch]
- Same pattern: found in [files] → DEBT.md
```

---

## ANTI-PATTERNS — NEVER DO THESE

### ❌ Symptom patching
```typescript
// FORBIDDEN — this hides the bug
try {
  return user.id;
} catch {
  return null; // ← why is user undefined? we don't know.
}
```

### ❌ Null silencing
```typescript
// FORBIDDEN — this does not fix anything
return user?.id; // ← added ?. but user should never be undefined here
```

### ❌ Guessing without tracing
Symptom: `TypeError: Cannot read property 'name' of undefined`
Bad response: "I'll add a null check here"
Good response: Trace WHY it's undefined, THEN decide if null check is appropriate

### ❌ Fixing without understanding
If you cannot explain WHY your fix works in one sentence → you don't understand the fix.
Stop. Trace more. Then fix.
