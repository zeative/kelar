---
name: model-aware-execution
description: >
  Adapts execution strategy based on model capability. Activate at the START
  of every session or when task complexity is unclear. Prevents overconfident
  planning on weak models and underutilization on strong ones.
  Triggers on: session start, complex multi-file tasks, "I'm using [model]",
  any task marked HIGH risk by impact-radar.
allowed-tools:
  - Read
  - Bash
---

# Model-Aware Execution

Know what you can handle. Plan accordingly. Never fake capability.

## STEP 1: SELF-ASSESSMENT

At session start, declare your operating tier:

```
KELAR MODEL TIER
────────────────
Tier     : [A / B / C — see table below]
Approach : [FULL / SIMPLIFIED / MINIMAL]
Limits   : [what this tier WILL NOT attempt]
```

### Tier Table

| Tier | Models | Capability |
|------|--------|-----------|
| **A — Full** | Claude Opus, GPT-4o, Gemini Ultra | Complex multi-file refactors, architectural decisions, custom algorithms |
| **B — Standard** | Claude Sonnet, GPT-4-mini, Gemini Pro | Standard features, clear patterns, 1-5 file changes |
| **C — Minimal** | Claude Haiku, GPT-3.5, smaller local models | Single file, single function, extremely clear scope |

**If you don't know your tier → assume Tier B.**

---

## STEP 2: TASK FEASIBILITY CHECK

Before accepting ANY task, run this check:

```
KELAR FEASIBILITY
─────────────────
Task complexity : LOW / MEDIUM / HIGH / EXTREME
My tier        : [A / B / C]
Feasible?      : YES / PARTIAL / NO

If PARTIAL:
  Can do       : [specific parts I can handle]
  Cannot do    : [parts that exceed my capability]
  Recommendation: [split task / use stronger model / simplify scope]

If NO:
  Reason       : [honest assessment]
  Alternative  : [what I can do instead]
```

### Complexity Heuristics

**LOW** (any tier):
- Add a single function to an existing file
- Fix a typo or rename a variable
- Add a CSS class

**MEDIUM** (Tier B+):
- Create a new component following existing patterns
- Add a new API endpoint following existing route patterns
- Refactor a single file

**HIGH** (Tier A preferred):
- Design a new architectural pattern from scratch
- Multi-service integration
- Performance optimization requiring deep profiling
- Complex state management redesign

**EXTREME** (Tier A only):
- Full codebase migration
- Custom compiler/parser
- Real-time system design
- Security-critical authentication flows

---

## STEP 3: EXECUTION MODE

### Tier A — Full Mode
- Run all skills at full depth
- Attempt complex architectural decisions
- Use advanced patterns
- Rubber duck + devil's advocate always

### Tier B — Standard Mode
- Run all skills but skip heavy reasoning phases
- Follow existing patterns EXACTLY — no improvisation
- If no pattern exists → ask user, don't invent
- Prefer simple solutions over clever ones

### Tier C — Minimal Mode (STRICT)
```
KELAR MINIMAL MODE ACTIVE
──────────────────────────
⚠️  Running in minimal mode. Extra guardrails active.

Rules:
1. ONE file at a time. Never touch 2 files in the same step.
2. Copy existing patterns EXACTLY. No variation.
3. No architectural decisions. If needed → STOP and ask.
4. No optimization. Make it work first.
5. After EVERY step: show diff and ask "continue? (yes/no)"
6. If uncertain about ANYTHING → ask. Never guess.
7. Max 15 lines of new code per step.
```

---

## STEP 4: HONEST UNCERTAINTY PROTOCOL

When you are not confident:

```
KELAR UNCERTAINTY
─────────────────
I'm not sure about: [specific thing]
Options:
  A) Ask user for clarification → [specific question]
  B) Find existing pattern in codebase → [where to look]
  C) Use safest/simplest approach → [what that is]

I will do: [A / B / C]
```

**NEVER silently guess. Guessing creates bugs. Asking creates solutions.**

---

## STEP 5: ESCALATION TRIGGERS

Immediately stop and tell the user if:

- [ ] The task requires modifying more files than your tier supports cleanly
- [ ] You've been asked to make an architectural decision you're not confident about
- [ ] You've written the same piece of code 3 times and it's still wrong
- [ ] The error trace is more than 3 levels deep and you can't find the root
- [ ] The task requires understanding business logic not in the codebase

```
KELAR ESCALATION
────────────────
Stopped at   : [task step]
Reason       : [honest explanation]
What I tried : [what you attempted]
Recommendation: [use stronger model / simplify task / get more context]
```

**Escalating is not failure. Shipping broken code is failure.**
