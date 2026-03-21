---
name: deep-debug
description: >
  Handles systematic debugging with root cause analysis. This skill should be used when
  the user reports an error, bug, unexpected behavior, or asks to fix something broken.
  Triggers on: "error", "bug", "broken", "fix", "not working", "fails", "crash",
  "wrong output", "exception", "undefined", "null", "TypeError", "cannot read".
  Always trace to root cause — never patch symptoms.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
---

# Deep Debug Protocol

Symptoms are clues, not answers. Find the disease, not just the rash.

## PHASE 1: INTAKE

```
KELAR DEBUG INTAKE
──────────────────
Error   : [full message]
Trigger : [what caused it]
Expected: [should happen]
Actual  : [happens instead]
```

If stack trace is missing → ask for it before proceeding. Do not guess.

## PHASE 2: TRACE

Trace **minimum 3 levels deep** before concluding root cause:
```
Surface  : [file:line where error shows]
Called by: [1 level up]
Origin   : [where bad data/state begins]
Type     : data | logic | integration | race condition | config
```

## PHASE 3: ROOT CAUSE

```
KELAR ROOT CAUSE
────────────────
Root cause  : [ONE sentence — what is actually wrong]
Why it fails: [the mechanism]
Why not caught: [missing validation? wrong assumption? edge case?]
```

Do not proceed to fixes until root cause is clear.
If uncertain → state two hypotheses + how to verify each.

## PHASE 4: IMPACT

```
KELAR IMPACT
────────────
Affects     : [files/functions depending on broken code]
Risk if fixed: [could break X because Y]
Same pattern: [found in: [files] / not found]
```

## PHASE 5: FIX OPTIONS

Present 2-3 options. Never just one.

```
KELAR FIX OPTIONS
─────────────────
Option A: [desc] — Pros: / Cons: / Risk: low|medium|high
Option B: [desc] — Pros: / Cons: / Risk: low|medium|high
Recommended: [A/B] because [reason]
```

**STOP. Wait for user to choose.**

## PHASE 6: EXECUTE + VERIFY

```
KELAR FIX APPLIED
─────────────────
Fixed in     : [file:line]
Root cause   : addressed ✓
Impact check : [clean / regression in X]
Code quality : passed ✓
```

## NEVER
- Fix symptom without root cause
- Add null checks to silence errors without understanding why null occurs
- Wrap in try/catch to hide errors
- Apply a fix without understanding why it works
