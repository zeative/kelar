---
name: reasoning-quality
description: >
  Improves reasoning quality before complex tasks using rubber duck and devil's advocate
  techniques. This skill should be used before executing complex features, architectural
  decisions, multi-file changes, security-critical code, or anything touching core business
  logic. SKIP for: rename, simple 1-file add, copy-paste patterns.
  RUN for: new feature, multi-file change, new pattern, unclear bug root cause.
allowed-tools:
  - Read
  - Glob
  - Grep
---

# Reasoning Quality: Rubber Duck + Devil's Advocate

Think before you build. Attack your own plan before anyone else does.

## PHASE 1: RUBBER DUCK

Before planning anything, explain the task to yourself out loud:

```
KELAR RUBBER DUCK
─────────────────
"To implement [X], I need to [step 1], then [step 2].
 The core mechanism is: [explain].
 I'm assuming: [list assumptions explicitly].
 The tricky part is: [identify hardest part].
 I'll handle it by: [specific approach]."
```

**If you can't complete this coherently → read more files first.**

## PHASE 2: DEVIL'S ADVOCATE

Challenge your own plan:

```
KELAR DEVIL'S ADVOCATE
───────────────────────
❓ What if [assumption] is wrong?
   → Then: [what breaks] → Mitigation: [how to handle]

❓ Edge case: [case]
   → Impact: [what happens] → Handled by: [how / "flagging to user"]

❓ Performance concern: [what could be slow]
   → At scale: [impact] → Mitigation: [approach]

❓ Security concern: [what could be exploited]
   → Risk: [severity] → Mitigation: [approach]

❓ Simpler approach?
   → Alternative: [desc] → Why NOT using it: [reason]

Verdict: SOLID / NEEDS ADJUSTMENT ([changes]) / CRITICAL FLAW ([rethink])
```

## PHASE 3: CONFIDENCE

```
KELAR CONFIDENCE
────────────────
Confidence: HIGH / MEDIUM / LOW
Reason    : [why]
Unknowns  : [if any]
Proceed?  : YES / "Need clarification on [X]"
```

**LOW confidence → must ask user before proceeding.**

## ADAPTIVE
Small task (1 file, clear scope): skip entirely.
Medium task (2-5 files): Phase 1 only.
Large/critical (5+ files, core logic, auth, payments): full Phase 1+2+3.
