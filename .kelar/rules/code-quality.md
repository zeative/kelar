# Code Quality

Zero hardcode. Scan before write. Clean code. Error handling mandatory. Self-check before done.

## 1. ZERO HARDCODE
Never hardcode values that belong in config, env, or constants.

FORBIDDEN: `const API_URL = "https://api.example.com"`
REQUIRED:  `const API_URL = process.env.API_URL`

If no config system exists → create one first, then use it.

## 2. SCAN BEFORE WRITE
Before writing any code:
1. Find 2-3 existing files similar to what you're building
2. Extract patterns: naming, structure, error handling, imports
3. Mirror those patterns exactly — no improvisation

## 3. CLEAN CODE
- Functions: verb-first (`getUser`, `validateToken`, `buildQuery`)
- Booleans: prefix `is/has/can/should`
- No single-letter vars except loop counters
- Max 20 lines per function — if longer, extract
- Max 3 parameters — if more, use an object
- Comment WHY, never WHAT

## 4. EFFICIENCY
- No N+1 queries
- No fetching unused data
- No nested callbacks > 2 levels
- Check if logic already exists before writing it

## 5. ERROR HANDLING IS NOT OPTIONAL
Every async/fallible operation MUST have error handling.
Follow the error pattern already used in the codebase.

## 6. SELF-CHECK BEFORE DONE
- [ ] Zero hardcoded values
- [ ] Naming matches codebase conventions
- [ ] No function longer than 20 lines
- [ ] Error handling on all async/fallible ops
- [ ] No duplicate logic
- [ ] No unused imports or variables
- [ ] Patterns match existing code in same layer
