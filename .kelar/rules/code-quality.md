# KELAR Rule: Code Quality

## Status: ALWAYS ON
These rules apply to every single task, no exceptions.

---

## 1. ZERO HARDCODE POLICY

Never hardcode values that belong in config, env, or constants.

**FORBIDDEN:**
```
const API_URL = "https://api.example.com"
const MAX_RETRY = 3
const SECRET_KEY = "abc123"
```

**REQUIRED:**
```
const API_URL = process.env.API_URL
const MAX_RETRY = config.maxRetry
const SECRET_KEY = env.SECRET_KEY
```

If a config/env system doesn't exist yet → create it first, then use it.

---

## 2. SCAN BEFORE WRITE

Before writing any code, you MUST:

1. Identify 2-3 existing files similar to what you're about to write
2. Extract the patterns used: naming, structure, error handling, imports
3. Mirror those patterns exactly — no improvisation

**The rule:** If the codebase does it one way, you do it that same way. Always.

---

## 3. CLEAN CODE STANDARDS

**Naming:**
- Variables and functions: describe what they DO or ARE, not how they work
- Boolean: prefix with `is`, `has`, `can`, `should`
- Functions: verb-first (`getUser`, `validateToken`, `buildQuery`)
- No single-letter variables except loop counters (`i`, `j`)
- No abbreviations unless they're universal (`id`, `url`, `api`, `db`)

**Functions:**
- One function = one responsibility
- Max 20 lines per function — if longer, extract
- Max 3 parameters — if more, use an object
- Always explicit return types (typed languages)

**Comments:**
- Comment WHY, never WHAT
- If code needs a comment to explain what it does → rewrite the code
- TODO comments must include: reason + ticket/issue ref

---

## 4. EFFICIENCY FIRST

Before choosing an implementation approach, ask:
- Is there a simpler way to achieve the same result?
- Does this introduce unnecessary loops, queries, or re-renders?
- Am I duplicating logic that already exists somewhere?

**Forbidden patterns:**
- N+1 queries
- Fetching data you don't use
- Re-computing values inside loops that could be cached
- Nested callbacks more than 2 levels deep

---

## 5. ERROR HANDLING IS NOT OPTIONAL

Every function that can fail MUST have error handling.

**FORBIDDEN:**
```javascript
const data = await fetchUser(id)
return data.name
```

**REQUIRED:**
```javascript
const data = await fetchUser(id)
if (!data) throw new NotFoundError(`User ${id} not found`)
return data.name
```

Follow the error handling pattern already used in the codebase. If none exists → establish one and document it in .kelar/state/STATE.md.

---

## 6. SELF-CHECK BEFORE DONE

Before marking any task complete, verify:

- [ ] Zero hardcoded values
- [ ] Naming matches codebase conventions
- [ ] No function longer than 20 lines
- [ ] Error handling present on all async/fallible operations
- [ ] No duplicate logic (check if it already exists elsewhere)
- [ ] No unused imports or variables
- [ ] Patterns match existing code in the same layer
