# Output Quality
## Status: ALWAYS ON — RUNS LAST, BEFORE EVERY TASK COMPLETION

## THE FINAL GATE

Before you say "done", "here you go", or anything that implies task completion:
Run this gate. Every time. No shortcuts.

---

## GATE 1: COMPLETENESS CHECK

```
[ ] All requirements from the task are addressed
[ ] Edge cases from UNDERSTAND phase are handled
[ ] All states exist (loading, error, empty, success)
[ ] Nothing is "TODO" or "coming soon" in the code
[ ] No placeholder text in production code ("lorem ipsum", "test data", etc.)
```

**If any box is unchecked → the task is NOT done. Keep going.**

---

## GATE 2: CORRECTNESS CHECK

```
[ ] The code does what was asked, not what you assumed was asked
[ ] Data flows correctly from source to destination
[ ] Error cases return/throw appropriate values, not silently fail
[ ] Async operations are properly awaited
[ ] No type assertions that hide real type mismatches (no `as any` unless justified)
```

---

## GATE 3: CONSISTENCY CHECK

```
[ ] Naming follows the exact conventions found in Phase 1 scan
[ ] File structure matches existing project structure
[ ] Imports use the same style (relative/alias/absolute) as surrounding files
[ ] Export style matches existing files in the same folder
[ ] Error messages follow the same format as existing errors
```

---

## GATE 4: CODE QUALITY CHECK

```
[ ] Zero hardcoded values
[ ] No function longer than 20 lines
[ ] No function with more than 3 parameters (or uses options object)
[ ] Error handling on all async operations
[ ] No unused imports or variables
[ ] No N+1 queries
[ ] Comments explain WHY not WHAT
```

---

## GATE 5: SCOPE CHECK

```
[ ] Only files declared in scope were modified
[ ] No unauthorized fixes or refactors
[ ] Out-of-scope observations are in DEBT.md
[ ] The diff contains only what was asked for
```

---

## GATE 6: UI-SPECIFIC (if task included any UI)

```
[ ] ui-quality checklist passed (see ui-quality skill)
[ ] All 8 component states implemented
[ ] Design tokens used, no hardcoded colors/spacing
[ ] Responsive on mobile
[ ] Accessible (semantic HTML, labels, contrast)
```

---

## WHAT TO DO IF A GATE FAILS

Do not hide it. Do not submit anyway. Fix it or explain why it can't be fixed now.

```
KELAR OUTPUT GATE RESULT
─────────────────────────
Gate 1 — Completeness : PASS / FAIL [what failed]
Gate 2 — Correctness  : PASS / FAIL [what failed]
Gate 3 — Consistency  : PASS / FAIL [what failed]
Gate 4 — Code Quality : PASS / FAIL [what failed]
Gate 5 — Scope        : PASS / FAIL [what failed]
Gate 6 — UI Quality   : PASS / N/A / FAIL [what failed]

Overall: ALL PASS → submit | ANY FAIL → [fix first / explain why deferred]
```

---

## THE COMPLETION FORMAT

When all gates pass, use this exact format:

```
KELAR TASK COMPLETE
────────────────────
Done     : [task name]
Created  : [new files, if any]
Modified : [changed files with one-line summary of change]
Result   : [one sentence — what can the user now do that they couldn't before?]
Quality  : all gates passed ✓

[any relevant notes — gotchas, follow-up suggestions, DEBT items found]
```

This format is not optional. It communicates clearly and builds trust.
