---
name: deep-debug
description: >
  Activate when user reports an error, bug, unexpected behavior, or asks to fix something broken.
  Triggers on: "error", "bug", "broken", "fix", "not working", "fails", "crash", "wrong output",
  "exception", "undefined", "null", "TypeError", "cannot read", "unexpected"
---

# KELAR Skill: Deep Debug Protocol

Symptoms are clues, not answers. Find the disease, not just the rash.

---

## PHASE 1: INTAKE

Collect full context before touching anything.

**Required information:**
- Full error message + stack trace
- What action triggered the error
- What was the expected behavior
- What is the actual behavior
- Recent changes (if any)

If stack trace is missing → ask for it before proceeding.

**Output:**
```
KELAR DEBUG INTAKE
──────────────────
Error     : [error message]
Trigger   : [what caused it]
Expected  : [what should happen]
Actual    : [what happens instead]
Recent changes: [yes/no — what changed]
```

---

## PHASE 2: TRACE

Follow the error to its origin. Do not stop at the first suspicious line.

**Tracing steps:**
1. Identify the file and line where the error surfaces
2. Trace backwards: what called that function? What called that?
3. Identify where the bad data/state originates
4. Check: is this a data problem, logic problem, or integration problem?

**Trace at least 3 levels deep before concluding root cause.**

**Output:**
```
KELAR TRACE
───────────
Surface     : [file:line where error shows]
Called by   : [file:line — 1 level up]
Origin      : [file:line — where bad data/state begins]
Type        : data | logic | integration | race condition | config
```

---

## PHASE 3: ROOT CAUSE ANALYSIS

State the root cause in one clear sentence.

**Format:**
```
KELAR ROOT CAUSE
────────────────
Root cause: [one sentence — what is actually wrong]
Why it fails: [explain the mechanism — why this causes the error]
Why it wasn't caught: [missing validation? wrong assumption? edge case?]
```

**Do not proceed to fixes until root cause is confirmed.**
If root cause is uncertain → state two hypotheses, explain how to verify each.

---

## PHASE 4: IMPACT ANALYSIS

Before fixing, understand the blast radius.

**Check:**
- What other code depends on the broken code?
- Could fixing this break something else?
- Is this error happening in other places too (same pattern, different files)?

**Output:**
```
KELAR IMPACT
────────────
Affects     : [list of files/functions that depend on broken code]
Risk if fixed: [could break X because Y]
Same pattern elsewhere: [yes — found in: / no]
```

---

## PHASE 5: FIX OPTIONS

Present 2-3 fix options. Never present just one.

**Format:**
```
KELAR FIX OPTIONS
─────────────────
Option A: [description]
  Pros: [why this is good]
  Cons: [tradeoffs]
  Risk: low | medium | high

Option B: [description]  
  Pros: [why this is good]
  Cons: [tradeoffs]
  Risk: low | medium | high

Recommended: [A or B] because [reason]
```

**STOP. Wait for user to choose.**

---

## PHASE 6: EXECUTE FIX

After user selects an option:

1. Apply the fix — only to files in scope
2. Verify the fix addresses the root cause (not just the symptom)
3. Check that nothing in the impact list is broken
4. Run self-check from code-quality.md

**Output:**
```
KELAR FIX APPLIED
─────────────────
Fixed in  : [file:line]
Root cause: addressed ✓
Impact check: [no regression / regression found in X]
```

---

## ANTI-PATTERNS — NEVER DO THESE

- Fixing the symptom without finding the root cause
- Adding null checks to silence errors without understanding why null occurs
- Wrapping code in try/catch to hide errors
- Guessing fixes without tracing
- Applying a fix that "should work" without understanding why it works
