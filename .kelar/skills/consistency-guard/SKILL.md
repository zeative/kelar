---
name: consistency-guard
description: >
  Activate when working on UI components, adding new modules, creating new files in existing
  layers, or when the user asks to "match", "follow the style", "be consistent", or "like the
  existing ones". Also auto-activates during pre-execution phase for any UI-related task.
  Triggers on: "component", "UI", "design", "style", "layout", "page", "screen", "match existing"
---

# KELAR Skill: Consistency Guard

Every new piece must look and feel like it was always there.

---

## PHASE 1: PATTERN SCAN

Before writing anything, scan the existing codebase for patterns.

### For UI/Frontend Tasks:

**Scan these specifically:**
1. Find 2-3 existing components/pages most similar to what you're building
2. Extract: spacing values, color usage, component structure, state management pattern
3. Find the design token file (CSS variables, theme file, constants)
4. Check how loading/error/empty states are handled

**Output:**
```
KELAR CONSISTENCY SCAN — UI
────────────────────────────
Reference files : [files you scanned]
Spacing scale   : [values in use — e.g. 4, 8, 16, 24, 32px]
Colors          : [tokens in use — e.g. var(--color-primary)]
Component shape : [how components are structured]
State handling  : [how loading/error/empty states work]
Icon system     : [what icon library/system is used]
Animation       : [transition values in use]
```

### For Backend/Logic Tasks:

**Scan these specifically:**
1. Find existing modules in the same layer (service, repo, controller, etc.)
2. Extract: function signature patterns, return types, error throwing pattern
3. Find how the module is exported and imported elsewhere
4. Check how similar operations are named

**Output:**
```
KELAR CONSISTENCY SCAN — BACKEND  
──────────────────────────────────
Reference files  : [files you scanned]
Function pattern : [how functions are structured]
Return pattern   : [what functions return]
Error pattern    : [how errors are thrown]
Export pattern   : [how modules are exported]
Naming pattern   : [how similar things are named]
```

---

## PHASE 2: CONSISTENCY MAPPING

Map what you're about to build to what already exists.

```
KELAR CONSISTENCY MAP
─────────────────────
Building      : [what you're creating]
Should match  : [reference file/component]
Will reuse    : [existing utilities/components/functions]
Will mirror   : [patterns from reference]
Will NOT invent: [things you won't create from scratch because they exist]
```

---

## PHASE 3: DEVIATION ALERTS

If the task REQUIRES deviating from existing patterns (new pattern needed):

```
KELAR DEVIATION ALERT
─────────────────────
Pattern     : [what pattern needs to change or be new]
Reason      : [why existing pattern doesn't work here]
Proposal    : [what new pattern you propose]
Impact      : [does this affect other files?]

Approve deviation? (yes/no)
```

**Do not deviate without explicit user approval.**

---

## PHASE 4: CONSISTENCY VERIFICATION

After implementation, verify before marking done:

**UI Checklist:**
- [ ] Uses only existing color tokens (no new hex/rgb values)
- [ ] Uses existing spacing scale (no arbitrary pixel values)
- [ ] Component structure matches reference component
- [ ] Loading state matches existing loading pattern
- [ ] Error state matches existing error pattern
- [ ] Empty state matches existing empty pattern
- [ ] Responsive behavior matches existing components
- [ ] Animations use existing transition values

**Backend Checklist:**
- [ ] Function signatures match existing layer conventions
- [ ] Return types consistent with similar functions
- [ ] Error types match existing error system
- [ ] Module exports match existing pattern
- [ ] Naming follows existing conventions in this layer
