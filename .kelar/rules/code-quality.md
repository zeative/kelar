# Code Quality
## Status: ALWAYS ON — NO EXCEPTIONS — THIS IS NOT OPTIONAL

## ⛔ BEFORE YOU WRITE A SINGLE LINE

Answer these 3 questions:
1. Does this logic already exist somewhere in the codebase?
2. What is the existing pattern I should follow in this layer?
3. What will break if this fails?

If you cannot answer all 3 → READ MORE FILES before writing.

---

## RULE 1: ZERO HARDCODE

**Every value that can change belongs in config, env, or constants.**

FORBIDDEN — will be caught in self-check:
```javascript
const API_URL = "https://api.example.com";      // ❌
const TIMEOUT = 5000;                            // ❌
const MAX_RETRY = 3;                             // ❌
const SECRET_KEY = "abc123";                    // ❌ (also a security issue)
```

REQUIRED — always do this:
```javascript
const API_URL = process.env.API_URL;             // ✓
const TIMEOUT = config.get('timeout');           // ✓
const MAX_RETRY = constants.MAX_RETRY;           // ✓
const SECRET_KEY = process.env.SECRET_KEY;      // ✓
```

**No config system exists?** Create `src/config/constants.ts` FIRST, then use it.
Do NOT skip this step because it feels like extra work.

---

## RULE 2: SCAN BEFORE WRITE — MANDATORY

Before writing any function, component, or module:

**Step 2.1** — Find similar existing files:
```bash
# For a UserService
find src/ -name "*Service*" -o -name "*service*" | head -10

# For a React component
find src/ -name "*.tsx" | head -20

# For an API route
find src/ -path "*/routes/*" -o -path "*/api/*" | head -10
```

**Step 2.2** — Extract exactly these things from 2-3 reference files:
```
KELAR SCAN RESULT
─────────────────
Reference files: [file1, file2, file3]
Import style   : [relative/absolute/alias — exact format]
Export style   : [named/default/module.exports]
Async pattern  : [async/await / Promise / callback]
Error pattern  : [throw Error / return {error} / Result type / try-catch style]
Naming style   : [camelCase / PascalCase / kebab-case — per file type]
Function length: [typical lines per function in this codebase]
```

**Step 2.3** — Mirror those patterns EXACTLY. No exceptions, no "improvements."

---

## RULE 3: CLEAN CODE — SPECIFIC RULES WITH EXAMPLES

### Naming
```javascript
// Functions: verb-first
getUser()          ✓    user()             ❌
validateToken()    ✓    tokenValidation()  ❌
buildQueryString() ✓    queryString()      ❌
handleSubmit()     ✓    submit()           ❌

// Booleans: is/has/can/should prefix
isLoading          ✓    loading            ❌
hasPermission      ✓    permission         ❌
canDelete          ✓    deletable          ❌
shouldRetry        ✓    retry              ❌

// No single-letter variables (except loop counters i, j, k)
const user = ...   ✓    const u = ...      ❌
const index = ...  ✓    const x = ...      ❌
```

### Function size
```javascript
// MAX 20 LINES per function. If longer → extract.

// ❌ TOO LONG — extract the parts
async function processOrder(order) {
  // validate (10 lines)
  // calculate price (10 lines)
  // apply discount (10 lines)
  // save to DB (10 lines)
  // send email (10 lines)
}

// ✓ CORRECT — extracted functions
async function processOrder(order) {
  const validated = validateOrder(order);
  const price = calculatePrice(validated);
  const final = applyDiscount(price, order.userId);
  await saveOrder(final);
  await sendConfirmationEmail(order.userId, final);
}
```

### Parameters
```javascript
// MAX 3 parameters. If more → use options object.

// ❌ TOO MANY PARAMS
function createUser(name, email, role, teamId, isActive, plan) {}

// ✓ CORRECT — options object
function createUser({ name, email, role, teamId, isActive, plan }) {}
```

### Comments
```javascript
// Comment WHY, never WHAT. The code explains WHAT.

// ❌ USELESS COMMENT
// Loop through users
for (const user of users) { ... }

// ✓ USEFUL COMMENT
// Skip inactive users — billing only applies to active accounts
for (const user of users.filter(u => u.isActive)) { ... }
```

---

## RULE 4: EFFICIENCY — SPECIFIC CHECKS

Before writing any data fetching or query:

**N+1 check:** If you're calling a function inside a loop → STOP. Use batch fetch.
```javascript
// ❌ N+1 QUERY
for (const userId of userIds) {
  const user = await getUser(userId);  // N queries
}

// ✓ BATCH QUERY
const users = await getUsersByIds(userIds);  // 1 query
```

**Unused data check:** Are you fetching fields you don't use?
```javascript
// ❌ FETCHING EVERYTHING
const user = await db.user.findUnique({ where: { id } });
return user.name;  // only needed name, fetched 20 fields

// ✓ SELECT ONLY WHAT YOU NEED
const user = await db.user.findUnique({ where: { id }, select: { name: true } });
```

**Duplicate logic check:**
```bash
# Before writing any utility function
grep -r "functionName\|similar logic" src/ --include="*.ts" -l
```

---

## RULE 5: ERROR HANDLING — NOT OPTIONAL, NOT LATER

Every async/fallible operation needs error handling. Always. Even "simple" ones.

```javascript
// ❌ MISSING ERROR HANDLING
const data = await fetchUser(id);
return data.name;

// ✓ CORRECT
try {
  const data = await fetchUser(id);
  if (!data) throw new Error(`User ${id} not found`);
  return data.name;
} catch (error) {
  // Follow the error pattern already in the codebase
  logger.error('fetchUser failed', { id, error });
  throw error;  // or: return { error: error.message }
}
```

**Find the existing error pattern:**
```bash
grep -r "catch\|throw\|Error\|logger" src/ --include="*.ts" -l | head -5
```
Read one of those files. Use the SAME pattern. Do not invent a new one.

---

## RULE 6: COMMIT BEHAVIOR

{{COMMIT_BEHAVIOR}}

Commit format: `feat(kelar): [brief description]`

Examples:
- `feat(kelar): add user authentication service`
- `fix(kelar): resolve token validation null pointer`
- `refactor(kelar): extract price calculation to utils`

---

## RULE 7: SELF-CHECK — RUN BEFORE MARKING ANYTHING DONE

This is MANDATORY. Not a suggestion. Run through every item:

```
KELAR SELF-CHECK
────────────────
Code Quality Gate:
[ ] Zero hardcoded values (no raw strings/numbers that belong in config)
[ ] Naming: verbs for functions, is/has/can for booleans, no single-letter vars
[ ] No function longer than 20 lines
[ ] No function with more than 3 parameters (or uses options object)
[ ] Error handling on ALL async/fallible operations
[ ] No N+1 queries or unnecessary data fetching
[ ] No duplicate logic (checked with grep before writing)
[ ] No unused imports or variables
[ ] Patterns match existing code in same layer (verified by scan)
[ ] Comments explain WHY not WHAT

Scope Guard:
[ ] Only modified files in task scope
[ ] No "bonus" fixes or refactors outside task
[ ] Out-of-scope issues logged to DEBT.md

Result: PASS / FAIL (list what failed)
```

**If FAIL → fix the failures before marking task done. No exceptions.**
