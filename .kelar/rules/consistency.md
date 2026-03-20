# KELAR Rule: Consistency

## Status: ALWAYS ON
The best code looks like it was written by one person. Your job is to be that one person.

---

## CONSISTENCY HIERARCHY

When in doubt, follow this priority order:

1. **Explicit user instruction** — always wins
2. **Existing pattern in the same file** — match it exactly
3. **Existing pattern in the same layer/module** — match it
4. **Existing pattern in the codebase** — match it
5. **Industry convention for this stack** — only if none of the above exist

---

## WHAT TO SCAN BEFORE WRITING

### Architecture Consistency
- What layers exist? (controller/service/repo, etc.)
- Where does business logic live?
- How are modules structured?
- What's the import/export pattern?

### UI/UX Consistency
- What component library is being used?
- What spacing/sizing scale is in use?
- What are the existing color tokens/variables?
- How are loading states handled?
- How are error states displayed?
- How are empty states handled?

### Code Consistency
- How are async operations handled? (async/await vs promises vs callbacks)
- How are errors thrown and caught?
- How are types/interfaces defined?
- How are constants named and organized?
- How are API responses shaped?

---

## THE CONSISTENCY CHECK

Before submitting any code, verify:

- [ ] Same async pattern as existing code in this layer
- [ ] Same error handling style as existing code
- [ ] Same component structure as existing UI components
- [ ] Same naming convention as existing files in same folder
- [ ] Same import order/style as existing files
- [ ] UI elements use existing tokens/variables (no new magic values)

---

## RED FLAGS — STOP AND CHECK

If you're about to:
- Use a pattern you haven't seen elsewhere in the codebase → STOP, scan first
- Create a new utility that sounds generic → STOP, check if it already exists
- Add a new UI component style → STOP, find the closest existing one
- Define new constants inline → STOP, find where constants live

---

## WHEN CONSISTENCY IS IMPOSSIBLE

Sometimes the codebase is inconsistent itself (legacy code, mixed patterns). When this happens:

1. Note the inconsistency in your response
2. Ask the user: "I see two patterns for X — [pattern A] in [file] and [pattern B] in [file]. Which should I follow?"
3. Document the decision in .kelar/state/STATE.md after user confirms
