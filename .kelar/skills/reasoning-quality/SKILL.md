---
name: reasoning-quality
description: >
  Activate before executing any complex task, making architectural decisions, or when
  the task involves multiple interdependent changes. NOT needed for simple quick tasks.
  Triggers on: complex features, architectural changes, "how should I", performance-critical
  code, security-related code, anything touching core business logic.
  
  Complexity threshold:
  - SKIP for: rename, simple add, copy-paste pattern, 1-file change
  - RUN for: new feature, multi-file change, new pattern, bug with unclear cause
---

# KELAR Skill: Rubber Duck + Devil's Advocate

Think before you build. Attack your own plan before anyone else does.

---

## PHASE 1: RUBBER DUCK

Before planning or writing anything, explain the task to yourself out loud.
This forces explicit reasoning and surfaces hidden assumptions.

### Format:
```
KELAR RUBBER DUCK
─────────────────
Task: [what needs to be done]

Thinking out loud:
"To implement [X], I need to [step 1], then [step 2], then [step 3].

The core mechanism is: [explain the key technical approach].

This works because: [explain why this approach is correct].

I'm assuming: [list assumptions explicitly].

The tricky part is: [identify the hardest/riskiest part].

I'll handle the tricky part by: [specific approach]."
```

**If you can't complete this coherently → you don't understand the task well enough yet. Read more files first.**

---

## PHASE 2: DEVIL'S ADVOCATE

Now attack your own plan. Find the weaknesses before they find you.

### Format:
```
KELAR DEVIL'S ADVOCATE
───────────────────────
Plan: [your proposed approach]

Challenging my own plan:

❓ What if [assumption A] is wrong?
   → Then: [what breaks]
   → Mitigation: [how to handle]

❓ What about [edge case]?
   → Impact: [what happens]
   → Handled by: [how / "not handled — flagging to user"]

❓ Performance concern: [what could be slow]
   → At scale: [what happens at 10x/100x load]
   → Mitigation: [approach]

❓ Security concern: [what could be exploited]
   → Risk: [severity]
   → Mitigation: [approach]

❓ Is there a simpler approach?
   → Alternative: [description]
   → Why I'm NOT using it: [reason]

Verdict after self-challenge:
→ Plan is SOLID — proceed ✓
→ Plan needs ADJUSTMENT — revised plan: [changes]
→ Plan has CRITICAL FLAW — need to rethink: [what to reconsider]
```

---

## PHASE 3: CONFIDENCE DECLARATION

After rubber duck + devil's advocate, state your confidence level:

```
KELAR CONFIDENCE
────────────────
Confidence  : HIGH / MEDIUM / LOW
Reason      : [why]
Unknowns    : [what you still don't know — if any]
Proceed?    : YES / "Need clarification on [X] first"
```

**LOW confidence → must ask user before proceeding.**
**MEDIUM confidence → flag unknowns, proceed with caution.**
**HIGH confidence → proceed.**

---

## ADAPTIVE BEHAVIOR

**Small task:** Skip this entirely. Just execute.

**Medium task (2-5 files, clear scope):**
- Run Rubber Duck only (Phase 1)
- Skip Devil's Advocate unless security/performance critical

**Large task (5+ files, new patterns, core logic):**
- Run full Phase 1 + 2 + 3
- Show output to user before planning

**Critical task (auth, payments, data integrity, public API):**
- Run full Phase 1 + 2 + 3
- Explicitly ask user to review Devil's Advocate section before proceeding
