---
name: consistency-guard
description: >
  Ensures new code matches existing patterns at both UI and backend levels.
  Activate when working on UI components, creating new modules, adding new files
  to existing layers, or when user asks to match/follow/be consistent with
  existing style.
  Triggers on: "component", "UI", "design", "style", "layout", "page", "screen"
allowed-tools:
  - Read
  - Glob
  - Grep
---

# Consistency Guard

Every new piece must look and feel like it was always there.

## PHASE 1: PATTERN SCAN

**For UI:**
```
Ref files  : [2-3 most similar components/pages]
Spacing    : [values in use]
Colors     : [tokens — e.g. var(--color-primary)]
Components : [structure pattern]
States     : [loading/error/empty patterns]
Icons      : [library in use]
Animation  : [transition values]
```

**For Backend:**
```
Ref files  : [existing modules in same layer]
Functions  : [signature pattern]
Returns    : [what functions return]
Errors     : [how errors are thrown]
Exports    : [module export pattern]
Naming     : [how similar things are named]
```

## PHASE 2: CONSISTENCY MAP

```
KELAR CONSISTENCY MAP
─────────────────────
Building   : [what you're creating]
Matches    : [reference file/component]
Will reuse : [existing utilities/components]
Will NOT invent: [things that already exist]
```

## PHASE 3: DEVIATION ALERT

If REQUIRED to deviate:
```
KELAR DEVIATION ALERT
─────────────────────
Pattern  : [what needs to change]
Reason   : [why existing doesn't work here]
Proposal : [new pattern]
Impact   : [affects other files?]

Approve deviation? (yes/no)
```

**Do NOT deviate without explicit approval.**

## PHASE 4: VERIFICATION

**UI:**
- [ ] Only existing color tokens (no new hex/rgb)
- [ ] Existing spacing scale (no arbitrary values)
- [ ] Component structure matches reference
- [ ] Loading/error/empty states match existing

**Backend:**
- [ ] Function signatures match layer conventions
- [ ] Return types consistent with similar functions
- [ ] Error types match existing error system
- [ ] Exports match existing pattern
