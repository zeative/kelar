# KELAR Workflow: /kelar:fix

**Trigger:** User has a bug, error, or broken behavior to resolve.
**Usage:** `/kelar:fix [description or paste error]`

---

## OVERVIEW

```
INTAKE → TRACE → ROOT CAUSE → IMPACT → OPTIONS → APPROVE → FIX → VERIFY
```

---

## STEP 1: INTAKE

Run **deep-debug** skill Phase 1 (Intake).

If error/stack trace not provided, ask:
- "Please paste the full error message and stack trace."
- "What action triggers this error?"
- "What did you expect to happen?"

Do not proceed without a stack trace or reproduction steps.

---

## STEP 2: TRACE + ROOT CAUSE

Run **deep-debug** skill Phase 2 & 3.

Trace minimum 3 levels deep.
State root cause in one sentence.

If uncertain between two hypotheses:
```
KELAR HYPOTHESIS
────────────────
Hypothesis A: [description]
  Verify by: [what to check]

Hypothesis B: [description]  
  Verify by: [what to check]

Which should I investigate first?
```

---

## STEP 3: IMPACT ANALYSIS

Run **deep-debug** skill Phase 4.

Identify blast radius before proposing fixes.

---

## STEP 4: FIX OPTIONS

Run **deep-debug** skill Phase 5.

Present 2-3 options. Never just one.
**STOP. Wait for user to choose.**

---

## STEP 5: EXECUTE FIX

After user selects option:

1. Apply fix — scope-guarded (only touch what's needed)
2. Verify root cause is addressed (not just symptom)
3. Check impact list for regressions
4. Run code-quality self-check

Output:
```
KELAR FIX COMPLETE
──────────────────
Root cause  : addressed ✓
Fix applied : [file:line — what changed]
Impact check: [clean / regression in X]
Code quality: passed ✓
```

---

## STEP 6: VERIFY

Confirm the fix works end-to-end:

```
KELAR FIX VERIFY
─────────────────
Original error  : [restate]
After fix       : [expected behavior now works]
Regression check: [nothing else broke]
Same pattern elsewhere: [checked and fixed / not found]
```

---

## .kelar/state/STATE.md UPDATE

After fix complete, append to .kelar/state/STATE.md:
```
## Fix: [Error/Bug Name] — [date]
- Root cause: [one sentence]
- Fixed in: [file:line]
- Approach: [what was done]
- Regression: none / [what was affected]
```
