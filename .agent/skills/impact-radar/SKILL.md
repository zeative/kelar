---
name: impact-radar
description: >
  Analyzes blast radius and establishes before/after contracts before modifying existing code.
  This skill should be used before modifying any existing file, before refactors, before bug
  fixes that change behavior, or before changing function signatures, data shapes, or renaming.
  Prevents surprise regressions by mapping all dependents before any change.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# Impact Radar + Before/After Contract

Know your blast radius before you pull the trigger. Define done before you start.

## PHASE 1: DEPENDENCY SCAN

Before touching any existing file:
```bash
grep -r "FunctionName\|ClassName\|filename" src/ --include="*.ts" -l
```

```
KELAR IMPACT RADAR
──────────────────
Changing  : [file or function]
Direct dependents:
  [file] — uses [what] — impact: breaking/non-breaking
Indirect  : [file] — [how affected]
Blast radius: [N files]
Risk: LOW / MEDIUM / HIGH
```

**HIGH risk → show to user, require explicit approval before proceeding.**

Risk levels:
- LOW: Only new code, no existing dependents
- MEDIUM: 1-3 dependents, non-breaking changes
- HIGH: 4+ dependents OR breaking changes OR core business logic

## PHASE 2: BEFORE/AFTER CONTRACT

```
KELAR CONTRACT
──────────────
BEFORE: [input] → [current output/behavior]
        [edge case] → [current edge behavior]

AFTER:  [input] → [new expected output]
        [edge case] → [new edge behavior]

Breaking change? : YES / NO

Done when:
[ ] AFTER behavior matches for main case
[ ] AFTER matches for all edge cases
[ ] All dependents still work
[ ] No new errors introduced
```

## PHASE 3: DEPENDENT UPDATE PLAN (if breaking)

```
KELAR DEPENDENTS
────────────────
[ ] [file] — needs: [what change]
Order: 1. core file → 2. [dependent A] → 3. [dependent B]
```

Add as micro-tasks to `.kelar/state/TASKS.md`.

## ADAPTIVE
New file (no dependents): skip Phase 1, still do Phase 2.
Modifying existing, few dependents: quick grep scan + full contract.
Core file, many dependents: full protocol, explicit user approval required.
