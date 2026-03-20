# KELAR Pattern Memory
> Append-only. Never delete entries. Updated when user approves an architectural decision.
> AI reads this at the start of every session — these decisions are FINAL unless user explicitly overrides.

Last updated: [timestamp]

---

## How This Works

Every time a decision is made and approved by the user, it gets logged here.
AI must check this file before making ANY architectural or pattern decision.
If the answer is here → follow it, don't ask again.
If the answer is NOT here → ask the user once, then log the decision here.

---

## Approved Patterns

### [Category — e.g. Error Handling]
- **Decision:** [what was decided]
- **Approved:** [date]
- **Reason:** [why]
- **Example:**
  ```
  [code example]
  ```

---

## Pattern Categories to Fill

> These will be populated as decisions are made during development.

- [ ] Error handling style
- [ ] API response shape
- [ ] Async pattern (async/await vs promise chains)
- [ ] Type definitions location and style
- [ ] Import order and aliasing
- [ ] State management approach
- [ ] Component structure (if frontend)
- [ ] Testing approach
- [ ] Logging style
- [ ] Environment variable access pattern
- [ ] Database query pattern
- [ ] Authentication/authorization pattern
- [ ] File naming conventions
- [ ] Folder structure conventions
