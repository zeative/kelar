---
name: pattern-memory
description: >
  Activate at the START of every session and before making any architectural decision.
  Also activate when user asks "how do we do X" or when AI is about to establish a new pattern.
  Triggers on: session start, architectural questions, "how should we", "what pattern",
  "which approach", any decision that will repeat across the codebase.
---

# KELAR Skill: Pattern Memory + Assumption Log

Don't ask the same question twice. Don't assume silently.

---

## ON SESSION START

Always run this at the beginning of every new session:

### Step 1: Load Pattern Memory
Read .kelar/state/PATTERNS.md.

Output:
```
KELAR MEMORY LOADED
───────────────────
Patterns on file: [N decisions]
Key patterns:
  - [category]: [brief summary of decision]
  - [category]: [brief summary of decision]
  (show top 5 most recently used)
```

### Step 2: Surface Unverified Assumptions
Read .kelar/state/ASSUMPTIONS.md. If any UNVERIFIED assumptions exist:

```
KELAR ASSUMPTION CHECK
──────────────────────
⚠️  [N] unverified assumption(s) need your input:

1. "[assumption]" — assumed [date]
   Correct? (yes / [actual value])

(type "skip" to handle later)
```

If no unverified assumptions → skip this step silently.

---

## BEFORE MAKING ANY PATTERN DECISION

Before introducing any new pattern, naming convention, or architectural approach:

### Step 1: Check Pattern Memory
```
Checking .kelar/state/PATTERNS.md for [topic]...
```

If found → **use it, don't ask again**. State:
```
Using established pattern for [topic]:
→ [pattern from .kelar/state/PATTERNS.md]
(approved [date])
```

If NOT found → proceed to Step 2.

### Step 2: Scan Codebase for Existing Pattern
Even if not in .kelar/state/PATTERNS.md, check if the pattern exists implicitly in the code.
Read 2-3 relevant existing files.

If found in code → use it AND add to .kelar/state/PATTERNS.md:
```
Found implicit pattern for [topic] in [file].
Adding to Pattern Memory for future reference.
```

If NOT found in code → proceed to Step 3.

### Step 3: Propose and Ask (Once)
```
KELAR PATTERN DECISION
──────────────────────
Topic   : [what needs a pattern decision]
Options :
  A) [approach] — [pros/cons]
  B) [approach] — [pros/cons]

Recommended: [A/B] because [reason]

Your choice? (A / B / other)
```

After user responds → immediately log to .kelar/state/PATTERNS.md.

---

## WHEN MAKING AN ASSUMPTION

If AI must assume something because information is missing:

### Format:
```
KELAR ASSUMPTION
────────────────
⚠️  Assuming: [what is being assumed]
    Because : [why — information was not available]
    Risk    : [what breaks if assumption is wrong]
    Logged  : .kelar/state/ASSUMPTIONS.md #[id]
```

Immediately append to .kelar/state/ASSUMPTIONS.md:
```markdown
### #[id] — [date] — UNVERIFIED
- **Assumed:** [what]
- **Because:** [why]
- **Risk:** [impact if wrong]
- **Used in:** [file:line]
```

---

## WHEN APPROVING A NEW PATTERN

After user approves a pattern decision, immediately append to .kelar/state/PATTERNS.md:

```markdown
### [Category]
- **Decision:** [exact pattern to follow]
- **Approved:** [date]
- **Reason:** [user's reason or inferred reason]
- **Example:**
  ```[language]
  [concrete code example]
  ```
- **Anti-pattern (don't do this):**
  ```[language]
  [what NOT to do]
  ```
```

---

## ADAPTIVE BEHAVIOR

**Small task (quick fix, rename, simple add):**
- Load patterns silently at start
- Apply known patterns without announcing
- Only surface assumptions if HIGH risk

**Large task (new feature, refactor, new module):**
- Load patterns explicitly, show summary
- Surface all unverified assumptions
- Ask for pattern decisions before planning
- Log everything
