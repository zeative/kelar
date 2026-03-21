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

1. Read `.kelar/state/PATTERNS.md`
```
KELAR MEMORY LOADED
───────────────────
Patterns on file: [N]
Key: [category]: [brief summary] (top 5)
```

2. Read `.kelar/state/ASSUMPTIONS.md` — surface UNVERIFIED items:
```
KELAR ASSUMPTION CHECK
──────────────────────
⚠️  [N] unverified assumption(s):
1. "[assumption]" — assumed [date] — correct? (yes / [actual value])
(type "skip" to handle later)
```

## BEFORE ANY PATTERN DECISION

1. Check `.kelar/state/PATTERNS.md` — if found, apply silently:
   `Using established pattern for [topic]: [pattern] (approved [date])`

2. If not found → scan codebase (read 2-3 files)
   If found → use it AND append to PATTERNS.md

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
After approval → immediately append to `.kelar/state/PATTERNS.md`

## WHEN MAKING AN ASSUMPTION

```
KELAR ASSUMPTION
────────────────
⚠️  Assuming: [what]
    Because : [why — info not available]
    Risk    : [what breaks if wrong]
```
Append to `.kelar/state/ASSUMPTIONS.md` immediately.

## ADAPTIVE
Small task: load patterns silently, only surface HIGH risk assumptions.
Large task: explicit pattern summary + all unverified assumptions shown.
