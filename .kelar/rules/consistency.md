# Consistency
## Status: ALWAYS ON

The best code looks like it was written by one person. Be that person.

## HIERARCHY (follow in order)
1. Explicit user instruction — always wins
2. Pattern in the same file
3. Pattern in the same layer/module
4. Pattern in the codebase
5. Industry convention (only if none above exist)

## SCAN BEFORE CREATING
For UI: find existing components, extract design tokens, spacing, color vars, state patterns
For Backend: find existing modules in same layer, extract function signatures, return types, error patterns

## CONSISTENCY CHECK
- [ ] Same async pattern as existing code in this layer
- [ ] Same error handling style
- [ ] Same component structure as existing UI
- [ ] Same naming convention as files in same folder
- [ ] UI uses existing tokens/variables (no new magic values)

## WHEN CODEBASE IS INCONSISTENT
Ask: "I see two patterns for X — [A] in [file] and [B] in [file]. Which should I follow?"
Document the decision in `.kelar/state/PATTERNS.md`.
