---
name: advanced-knowledge
description: >
  Manages persistent technical and domain knowledge across sessions.
  Activate when: discovering non-obvious solutions, encountering gotchas,
  learning codebase-specific patterns, or finding reusable approaches.
  This is the AI's long-term memory system separate from task tracking.
  Triggers on: "remember this", "save this", "I should note", discovering
  a bug pattern, finding an undocumented behavior, solving a hard problem.
allowed-tools:
  - Read
  - Write
  - Bash
---

# Advanced Knowledge System

**Things worth remembering deserve to be remembered.**

Not all knowledge is a pattern or a task. Some things are just... important to know.
This system captures what matters and makes it instantly accessible in future sessions.

---

## KNOWLEDGE TAXONOMY

### 1. Domain Knowledge (`.kelar/memory/domain/`)
What the business/product does, its rules, its constraints.
```
.kelar/memory/domain/
├── business-rules.md      # Core business logic that isn't obvious
├── data-model.md          # Entity relationships, key fields
├── user-flows.md          # How users interact with the system
└── constraints.md         # Hard limits (legal, technical, business)
```

### 2. Technical Knowledge (`.kelar/memory/technical/`)
How the codebase actually works (undocumented things).
```
.kelar/memory/technical/
├── gotchas.md             # Traps that cause bugs
├── performance.md         # Performance-sensitive areas
├── integration-notes.md   # How external services actually work
└── architecture-notes.md  # Why things are built the way they are
```

### 3. Solution Library (`.kelar/memory/solutions/`)
Reusable approaches to specific problem types.
```
.kelar/memory/solutions/
├── auth-patterns.md       # How auth works in this project
├── error-handling.md      # Project-specific error patterns
├── testing-patterns.md    # How tests are structured
└── api-patterns.md        # API design patterns used here
```

### 4. Environment Knowledge (`.kelar/memory/environment/`)
Setup, config, and operational knowledge.
```
.kelar/memory/environment/
├── setup-notes.md         # Non-obvious setup steps
├── env-vars.md            # What env vars exist and what they do
├── deploy-notes.md        # Deployment gotchas
└── tooling.md             # Tools, scripts, and how to use them
```

---

## WHEN TO SAVE KNOWLEDGE

**Save when any of these is true:**

✓ You encountered something that wasn't documented but took time to figure out
✓ You solved a problem in a non-obvious way
✓ You found a bug pattern that could appear elsewhere
✓ You learned an undocumented behavior of a library/API being used
✓ A user corrected an assumption you made (and the correct answer matters)
✓ You made an architectural decision (also write to PATTERNS.md)
✓ The solution to a problem is: "don't do X, do Y instead, because Z"

**Don't save:**
- Things in the documentation already
- Things the code itself makes obvious
- Task-specific details (those go in TASKS.md)

---

## SAVE FORMAT

Each knowledge entry uses this structure:

```markdown
## [Descriptive title — specific enough to find later]
Added: [YYYY-MM-DD]
Tags: [tag1, tag2, tag3]

### Context
[Why this knowledge matters — what problem it solves]

### What I Learned
[The actual knowledge — specific, actionable]

### Example
[Code snippet or concrete example if applicable]

### Gotcha / Warning
[What happens if you do it wrong — if relevant]

### Source
[Where this was discovered — PR, session, debugging, etc.]
```

---

## SESSION START: KNOWLEDGE RETRIEVAL

At session start, quickly scan available knowledge:

```bash
ls .kelar/memory/ 2>/dev/null && \
ls .kelar/memory/**/*.md 2>/dev/null | head -20 || \
echo "No knowledge base yet"
```

```
KELAR KNOWLEDGE LOADED
──────────────────────
Domain    : [N entries]
Technical : [N entries]  
Solutions : [N entries]
Env       : [N entries]

Key gotchas on file: [list top 3 most relevant to current task]
```

---

## KNOWLEDGE SEARCH

When starting a task, search relevant knowledge:

```bash
# Search for relevant knowledge entries
grep -r "[keyword]" .kelar/memory/ --include="*.md" -l 2>/dev/null
```

If found → read and apply silently. Don't announce it, just use it.
If relevant gotcha found → mention it proactively before writing code.

---

## KNOWLEDGE UPDATE PROTOCOL

When you discover new knowledge during a task:

1. **Identify category** — domain / technical / solution / environment
2. **Check if entry exists** — grep for related terms
3. **If new** → create entry in appropriate file
4. **If update** → append to existing entry (append-only)
5. **Log in TASKS.md** → `[HH:MM] 📚 KNOWLEDGE: saved "[title]" to [file]`

---

## KNOWLEDGE QUALITY RULES

### ✓ Good knowledge entry
```markdown
## JWT tokens expire silently in this codebase
Added: 2025-12-01
Tags: auth, jwt, gotcha

### Context
The auth middleware doesn't throw on expired tokens — it just returns null user.
This caused a production bug where expired sessions appeared authenticated.

### What I Learned
Always check `user !== null` AND `user.sessionValid === true` after auth middleware.
Checking only `!!user` is not sufficient.

### Example
// WRONG
if (user) { allowAccess(); }

// CORRECT  
if (user && user.sessionValid) { allowAccess(); }

### Source
Discovered during debugging session 2025-12-01, confirmed in AuthMiddleware.ts:67
```

### ❌ Bad knowledge entry
```markdown
## Auth stuff
JWT is used for auth. Check the token.
```

---

## MEMORY INDEX

Maintain `.kelar/memory/INDEX.md`:

```markdown
# KELAR Knowledge Index
Last updated: [timestamp]

## Quick Reference — Most Important
1. [Critical gotcha 1] → [file]
2. [Critical gotcha 2] → [file]
3. [Critical pattern] → [file]

## By Category
### Domain
- [entry title] — [one-line summary] — [file]

### Technical  
- [entry title] — [one-line summary] — [file]

### Solutions
- [entry title] — [one-line summary] — [file]

### Environment
- [entry title] — [one-line summary] — [file]
```

Update this index every time you add a new entry.

---

## KNOWLEDGE SHARING

Knowledge files should be:
- Committed to git (they're project knowledge, not personal state)
- Reviewed and pruned periodically (quarterly is good)
- Written as if for a new team member joining next week

The question to ask: "If a new developer asked me this question, what's the one thing they need to know?"
That's what goes in the knowledge base.
