---
name: impact-radar
description: >
  Activate before modifying any existing file (not just creating new ones), before any
  refactor, and before any bug fix. Maps what depends on the code being changed and
  establishes a before/after contract for the change.
  Triggers on: modifying existing files, refactoring, fixing bugs, changing function
  signatures, renaming, moving files, changing data shapes.
---

# KELAR Skill: Impact Radar + Before/After Contract

Know your blast radius before you pull the trigger.
Define done before you start.

---

## PHASE 1: IMPACT RADAR

Before touching any existing file, map what depends on it.

### Step 1: Dependency Scan

Run (or simulate if CLI unavailable):
```bash
# For TypeScript/JavaScript
grep -r "from.*[filename]" src/ --include="*.ts" --include="*.tsx" --include="*.js"
grep -r "require.*[filename]" src/ --include="*.js"

# For specific function/class
grep -r "[FunctionName|ClassName]" src/ --include="*.ts"
```

### Step 2: Impact Assessment

```
KELAR IMPACT RADAR
──────────────────
Changing  : [file or function]
Type      : [function signature / data shape / behavior / rename / delete]

Direct dependents:
  - [file] — uses [what specifically] — impact: [breaking/non-breaking]
  - [file] — uses [what specifically] — impact: [breaking/non-breaking]

Indirect dependents (depend on direct dependents):
  - [file] — [how affected]

Total blast radius: [N files]
Breaking changes  : [yes/no — what breaks]

Risk level: LOW / MEDIUM / HIGH
```

**Risk levels:**
- LOW: Only new code, no existing dependents
- MEDIUM: 1-3 dependents, non-breaking changes
- HIGH: 4+ dependents OR breaking changes OR core business logic

**HIGH risk → show impact radar to user and get explicit approval before proceeding.**

---

## PHASE 2: BEFORE/AFTER CONTRACT

Define exactly what changes from current state to desired state.
This becomes the definition of done.

### Format:
```
KELAR CONTRACT
──────────────
Changing: [what is being changed]

BEFORE (current behavior):
  Given : [input or condition]
  Result: [current output or behavior]

  Given : [edge case input]
  Result: [current edge case behavior]

AFTER (target behavior):
  Given : [same input]
  Result: [new expected output or behavior]

  Given : [same edge case]
  Result: [new edge case behavior]

Breaking change? : YES / NO
Migration needed?: YES / NO
```

### Verification Criteria (auto-generated from contract):
```
Task is DONE when:
  [ ] AFTER behavior matches for main case
  [ ] AFTER behavior matches for edge cases
  [ ] All direct dependents still work
  [ ] No new errors introduced
```

---

## PHASE 3: DEPENDENT UPDATE PLAN

If breaking changes exist, plan the dependent updates:

```
KELAR DEPENDENT UPDATES
────────────────────────
Breaking change in: [file]

Files that need updates:
  [ ] [file] — needs: [what change]
  [ ] [file] — needs: [what change]

Update order:
  1. Update [core file] first
  2. Update [dependent A]
  3. Update [dependent B]
  4. Verify all work together
```

Add these as additional micro-tasks to .kelar/state/TASKS.md.

---

## ADAPTIVE BEHAVIOR

**Small task (new file, isolated change):**
- Skip Impact Radar (no existing dependents)
- Still do Before/After Contract (defines done)

**Medium task (modifying existing, few dependents):**
- Quick Impact Radar (grep scan)
- Full Before/After Contract

**Large task (core file change, many dependents):**
- Full Impact Radar with explicit user approval
- Full Before/After Contract
- Full Dependent Update Plan
- Add all updates to .kelar/state/TASKS.md waves
