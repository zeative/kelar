---
name: pattern-memory
description: >
  Manages cross-session architectural decisions and assumption tracking.
  Activate at the START of every session and before any architectural decision.
  Prevents asking the same question twice. Tracks all assumptions until verified.
  Triggers on: session start, "how should we", "what pattern", "which approach"
allowed-tools:
  - Read
  - Write
  - Bash
---

# Pattern Memory + Assumption Log

Don't ask the same question twice. Don't assume silently.

## ON SESSION START

```bash
node .kelar/kelar-tools.cjs patterns list
```

```
KELAR MEMORY LOADED
───────────────────
Patterns on file: [N]
Key: [category]: [brief summary] (top 5)
```

Check ASSUMPTIONS.md — surface UNVERIFIED items:
```
KELAR ASSUMPTION CHECK
──────────────────────
⚠️  [N] unverified assumption(s):
1. "[assumption]" — assumed [date] — correct? (yes / [actual value])
(type "skip" to handle later)
```

## BEFORE ANY PATTERN DECISION

```bash
node .kelar/kelar-tools.cjs patterns get "[category]"
```

1. If found → apply silently: `Using established pattern for [topic]: [pattern] (approved [date])`
2. If not found → scan codebase (read 2-3 files). If found → use AND save:
```bash
node .kelar/kelar-tools.cjs patterns set "[category]" "[pattern description]"
```
3. If not found anywhere:
```
KELAR PATTERN DECISION
──────────────────────
Topic: [what needs deciding]
A) [approach] — [tradeoff]
B) [approach] — [tradeoff]
Recommended: [A/B] because [reason]
Your choice?
```
After approval → save immediately.

## WHEN MAKING AN ASSUMPTION

```
KELAR ASSUMPTION
────────────────
⚠️  Assuming: [what]
    Because : [why — info not available]
    Risk    : [what breaks if wrong]
```

Append to `.kelar/state/ASSUMPTIONS.md`.

## ADAPTIVE
Small task: load patterns silently, only surface HIGH risk assumptions.
Large task: explicit pattern summary + all unverified assumptions shown.
