'use strict';

// ─── Rules ───────────────────────────────────────────────────────────────────

function getRules(config) {
  const lang = config.language || 'en';
  const commitNote = config.autoCommit === 'auto'
    ? 'After each micro-task: commit automatically with message: feat(kelar): [task description]'
    : config.autoCommit === 'ask'
    ? 'After each micro-task: ask user before committing.'
    : 'Do NOT auto-commit. User commits manually.';

  return {
    'code-quality.md': `# KELAR Rule: Code Quality
## Status: ALWAYS ON

---

## 1. ZERO HARDCODE POLICY
Never hardcode values that belong in config, env, or constants.

FORBIDDEN: const API_URL = "https://api.example.com"
REQUIRED:  const API_URL = process.env.API_URL

If no config system exists → create one first, then use it.

---

## 2. SCAN BEFORE WRITE
Before writing any code:
1. Find 2-3 existing files similar to what you're building
2. Extract patterns: naming, structure, error handling, imports
3. Mirror those patterns exactly

If the codebase does it one way → you do it that same way. Always.

---

## 3. CLEAN CODE STANDARDS

Naming:
- Functions: verb-first (getUser, validateToken, buildQuery)
- Booleans: prefix with is/has/can/should
- No single-letter vars except loop counters
- No abbreviations unless universal (id, url, api, db)

Functions:
- One responsibility per function
- Max 20 lines — if longer, extract
- Max 3 parameters — if more, use an object
- Always explicit return types (typed languages)

Comments:
- Comment WHY, never WHAT
- If code needs a comment to explain what it does → rewrite the code

---

## 4. EFFICIENCY FIRST
Before choosing an implementation:
- Is there a simpler way?
- Does this introduce unnecessary loops, queries, or re-renders?
- Am I duplicating logic that already exists?

FORBIDDEN: N+1 queries, fetching unused data, nested callbacks > 2 levels

---

## 5. ERROR HANDLING IS NOT OPTIONAL
Every async/fallible operation MUST have error handling.
Follow the error pattern already used in the codebase.

---

## 6. COMMIT BEHAVIOR
${commitNote}
Commit format: feat(kelar): [brief description of what was done]

---

## 7. SELF-CHECK BEFORE DONE
Before marking any task complete:
[ ] Zero hardcoded values
[ ] Naming matches codebase conventions
[ ] No function longer than 20 lines
[ ] Error handling on all async/fallible operations
[ ] No duplicate logic
[ ] No unused imports or variables
[ ] Patterns match existing code in same layer
`,

    'scope-guard.md': `# KELAR Rule: Scope Guard
## Status: ALWAYS ON

You are a surgeon, not a janitor. Operate only on what you're asked to operate on.

---

## THE PRIME DIRECTIVE
Touch nothing you were not asked to touch.
Even if it looks wrong → leave it alone.
Even if you could "improve" it → leave it alone.

---

## IN SCOPE
- Files explicitly mentioned by the user
- Files that MUST be modified to implement the requested feature/fix
- New files required by the task

## OUT OF SCOPE — NEVER DO THESE
- Refactoring code outside the task files
- Renaming variables you weren't asked to rename
- Restructuring folder/file organization
- Adding "bonus" features not requested
- Removing code not explicitly marked for removal

---

## WHEN YOU SPOT SOMETHING WRONG (outside scope)
DO NOT fix it silently.
DO log it to .kelar/state/DEBT.md with format:
  "KELAR NOTICE — [file]: [issue] → suggest: /kelar:quick fix [desc]"

---

## SCOPE CONFIRMATION
Before any multi-file task:
  KELAR SCOPE
  ───────────
  Will modify : [list]
  Will create : [list]
  Will NOT touch: everything else

Wait for confirmation before proceeding.
`,

    'consistency.md': `# KELAR Rule: Consistency
## Status: ALWAYS ON

The best code looks like it was written by one person.

---

## CONSISTENCY HIERARCHY
1. Explicit user instruction — always wins
2. Existing pattern in the same file
3. Existing pattern in the same layer/module
4. Existing pattern in the codebase
5. Industry convention (only if none above exist)

---

## SCAN BEFORE CREATING ANYTHING
For UI: find existing components, extract design tokens, spacing, color vars
For Backend: find existing modules in same layer, extract function signatures, return types, error patterns

---

## CONSISTENCY CHECK (before submitting)
[ ] Same async pattern as existing code in this layer
[ ] Same error handling style
[ ] Same component structure as existing UI components
[ ] Same naming convention as files in same folder
[ ] UI uses existing tokens/variables (no new magic values)

---

## WHEN CONSISTENCY IS IMPOSSIBLE
If codebase has conflicting patterns:
1. Note the inconsistency
2. Ask: "I see two patterns for X — [A] in [file] and [B] in [file]. Which should I follow?"
3. Document the decision in .kelar/state/PATTERNS.md
`,
  };
}

// ─── Skills ──────────────────────────────────────────────────────────────────

function getSkills(config) {
  return {
    'pattern-memory': `---
name: pattern-memory
description: >
  Activate at the START of every session and before any architectural decision.
  Triggers on: session start, "how should we", "what pattern", "which approach",
  any decision that will repeat across the codebase.
---

# KELAR Skill: Pattern Memory + Assumption Log

Don't ask the same question twice. Don't assume silently.

## ON SESSION START

1. Read .kelar/state/PATTERNS.md
   Output:
     KELAR MEMORY LOADED
     ───────────────────
     Patterns on file: [N]
     Key: [category]: [brief summary] (top 5)

2. Read .kelar/state/ASSUMPTIONS.md — surface any UNVERIFIED items:
     KELAR ASSUMPTION CHECK
     ──────────────────────
     ⚠️  [N] unverified assumption(s):
     1. "[assumption]" — assumed [date] — correct? (yes / [actual value])
     (type "skip" to handle later)

## BEFORE ANY PATTERN DECISION

1. Check .kelar/state/PATTERNS.md — if found, apply silently
2. Scan codebase for implicit pattern — if found, use + log to PATTERNS.md
3. If not found anywhere:
     KELAR PATTERN DECISION
     ──────────────────────
     Topic: [what needs deciding]
     A) [approach] — [tradeoff]
     B) [approach] — [tradeoff]
     Recommended: [A/B] because [reason]
     Your choice?

After approval → immediately append to .kelar/state/PATTERNS.md

## WHEN MAKING AN ASSUMPTION

  KELAR ASSUMPTION
  ────────────────
  ⚠️  Assuming: [what]
      Because : [why — info not available]
      Risk    : [what breaks if wrong]

Append to .kelar/state/ASSUMPTIONS.md immediately.

## ADAPTIVE
Small task: load patterns silently, only surface HIGH risk assumptions
Large task: explicit pattern summary + all unverified assumptions
`,

    'reasoning-quality': `---
name: reasoning-quality
description: >
  Activate before complex tasks, architectural decisions, multi-file changes,
  security/performance-critical code, or anything touching core business logic.
  SKIP for: rename, simple add, 1-file change.
  RUN for: new feature, multi-file, new pattern, unclear bug cause.
---

# KELAR Skill: Rubber Duck + Devil's Advocate

Think before you build. Attack your own plan first.

## PHASE 1: RUBBER DUCK

Before planning anything, explain the task to yourself:

  KELAR RUBBER DUCK
  ─────────────────
  "To implement [X], I need to [step 1], then [step 2].
   The core mechanism is: [explain].
   I'm assuming: [list assumptions explicitly].
   The tricky part is: [identify hardest part].
   I'll handle it by: [approach]."

If you can't complete this coherently → read more files first.

## PHASE 2: DEVIL'S ADVOCATE

Attack your own plan:

  KELAR DEVIL'S ADVOCATE
  ───────────────────────
  ❓ What if [assumption] is wrong? → [what breaks] → [mitigation]
  ❓ Edge case: [case] → [impact] → [handled by / flagging to user]
  ❓ Performance: [concern] → [at scale] → [mitigation]
  ❓ Security: [concern] → [risk] → [mitigation]
  ❓ Simpler approach? → [alternative] → [why not using it]

  Verdict: SOLID / NEEDS ADJUSTMENT ([changes]) / CRITICAL FLAW ([rethink])

## PHASE 3: CONFIDENCE

  KELAR CONFIDENCE
  ────────────────
  Confidence: HIGH / MEDIUM / LOW
  Reason    : [why]
  Unknowns  : [if any]
  Proceed?  : YES / "Need clarification on [X]"

LOW → must ask user before proceeding.

## ADAPTIVE
Small task: skip entirely.
Medium task: Phase 1 only.
Large/critical: full Phase 1+2+3, show to user before planning.
`,

    'impact-radar': `---
name: impact-radar
description: >
  Activate before modifying any existing file, before refactors, and before bug fixes.
  Triggers on: modifying existing files, refactoring, fixing bugs, changing function
  signatures, renaming, moving files, changing data shapes.
---

# KELAR Skill: Impact Radar + Before/After Contract

Know your blast radius. Define done before you start.

## PHASE 1: DEPENDENCY SCAN

Before touching any existing file:
  grep -r "[functionName|className]" src/ --include="*.ts"

  KELAR IMPACT RADAR
  ──────────────────
  Changing  : [file or function]
  Direct dependents: [file] — uses [what] — impact: breaking/non-breaking
  Indirect  : [file] — [how affected]
  Blast radius: [N files]
  Risk: LOW / MEDIUM / HIGH

HIGH risk → show to user, require explicit approval before proceeding.

## PHASE 2: BEFORE/AFTER CONTRACT

  KELAR CONTRACT
  ──────────────
  BEFORE: [input] → [current output/behavior]
  AFTER:  [input] → [new expected output]

  Done when:
  [ ] AFTER behavior matches for main case
  [ ] AFTER matches for edge cases
  [ ] All dependents still work
  [ ] No new errors introduced

## PHASE 3: DEPENDENT UPDATE PLAN (if breaking changes)

  KELAR DEPENDENTS
  ────────────────
  [ ] [file] — needs: [what change]
  Order: 1. core file → 2. dependent A → 3. dependent B

Add as micro-tasks to .kelar/state/TASKS.md.

## ADAPTIVE
New file (no dependents): skip Phase 1, still do Phase 2.
Modifying existing, few dependents: quick scan + full contract.
Core file, many dependents: full protocol, explicit user approval required.
`,

    'execution-efficiency': `---
name: execution-efficiency
description: >
  Activate for repetitive changes across multiple files, batch operations,
  code generation, codebase-wide renaming, or any operation touching 4+ files
  with the same pattern.
  Triggers on: "rename all", "replace", "add to all", "generate", "scaffold",
  "update all files", any task touching 4+ files with same pattern.
---

# KELAR Skill: Execution Efficiency (CLI-first, Script-first)

A senior developer doesn't edit 20 files manually. They write a script.

## DECISION TREE

Can this be done more efficiently with CLI or script than manual editing?
YES → write script/command first, then execute
NO  → proceed with manual implementation

Signals a script is better:
- Same change in 3+ files
- Pattern-based transformation
- Boilerplate generation
- Any operation describable as "do X to all files that Y"

## APPROACH BY SCALE

1-3 files, unique changes    → manual edit
3-10 files, same pattern     → CLI one-liner
10+ files, complex pattern   → generated script (JS/Python/Bash)
Recurring task               → code generator (invest once, reuse forever)

## CLI EXAMPLES

# Text replacement across all TypeScript files
find src/ -name "*.ts" -exec sed -i 's/oldName/newName/g' {} +

# Find all usages of a function
grep -rn "functionName(" src/ --include="*.ts"

# Check for hardcoded values
grep -rn "localhost\\|127\\.0\\.0\\|hardcoded" src/ --include="*.ts"

## EXECUTION FORMAT

  KELAR EFFICIENCY MODE
  ─────────────────────
  Task    : [description]
  Approach: CLI / Script / Generator
  Affects : ~[N] files
  Reversible via: git diff / git restore

  [show script/command preview]

  Execute? (yes / review first / no)

After execution:
  git diff --stat  # verify what changed
  git diff src/[sample-file]  # spot check

## SCRIPT STORAGE
All generated scripts → .kelar/scripts/[date]-[action].js
Named descriptively. Keep them — they're documentation.
`,

    'pre-execution': `---
name: pre-execution
description: >
  Activate when user asks to build, implement, create, add, make, write, update, or change.
  Triggers on: "build", "create", "implement", "add", "make", "write", "update", "change"
---

# KELAR Skill: Pre-Execution Protocol

No code is written without an approved plan.

## PHASE 1: EXPLORE

Read relevant codebase context:
1. Find 2-3 files similar to what you're creating/modifying
2. Find the layer where this code belongs
3. Find existing utilities you might reuse
4. Read .kelar/state/STATE.md if exists

  KELAR EXPLORE
  ─────────────
  Files read: [list]
  Patterns:
    Structure    : [observed]
    Naming       : [observed]
    Error handling: [observed]
    Reusable     : [existing code to reuse]

## PHASE 2: UNDERSTAND

  KELAR UNDERSTAND
  ────────────────
  Goal        : [one sentence]
  Input       : [what goes in]
  Output      : [what comes out]
  Edges       : [edge cases]
  Out of scope: [what you will NOT do]

If anything is unclear → ask ONE clarifying question before continuing.

## PHASE 3: PLAN

  KELAR PLAN
  ──────────
  Task: [name]

  [ ] 1. [action] in [file] → done when: [condition]
  [ ] 2. [action] in [file] → done when: [condition]
  [ ] 3. [action] in [file] → done when: [condition]

  Files to modify: [list]
  Files to create: [list]
  Files untouched: everything else

  Approach:
    A) [approach] — [tradeoff]
    B) [approach] — [tradeoff]
  Recommended: [A/B] because [reason]

## PHASE 4: AWAIT APPROVAL

STOP. Do not write any code yet.
Present plan. Wait for: "yes" / edits / "no".
Only after explicit approval → execute.

## EXECUTION

For each micro-task:
1. Implement
2. Run code-quality self-check
3. Mark complete in .kelar/state/TASKS.md: [x] [timestamp] [task] — DONE
4. Show brief output
`,

    'deep-debug': `---
name: deep-debug
description: >
  Activate when user reports errors, bugs, unexpected behavior, or asks to fix something.
  Triggers on: "error", "bug", "broken", "fix", "not working", "fails", "crash",
  "wrong output", "exception", "undefined", "null", "TypeError"
---

# KELAR Skill: Deep Debug Protocol

Symptoms are clues, not answers. Find the disease, not just the rash.

## PHASE 1: INTAKE

  KELAR DEBUG INTAKE
  ──────────────────
  Error  : [message]
  Trigger: [what caused it]
  Expected: [should happen]
  Actual  : [happens instead]

If stack trace missing → ask for it before proceeding.

## PHASE 2: TRACE

Trace minimum 3 levels deep before concluding root cause:
  Surface     : [file:line where error shows]
  Called by   : [1 level up]
  Origin      : [where bad data/state begins]
  Type        : data | logic | integration | race condition | config

## PHASE 3: ROOT CAUSE

  KELAR ROOT CAUSE
  ────────────────
  Root cause : [ONE sentence — what is actually wrong]
  Why it fails: [the mechanism]
  Why not caught: [missing validation? wrong assumption?]

Do not proceed to fixes until root cause is clear.
Uncertain? State two hypotheses + how to verify each.

## PHASE 4: IMPACT

  KELAR IMPACT
  ────────────
  Affects      : [files/functions that depend on broken code]
  Risk if fixed: [could break X because Y]
  Same pattern elsewhere: [yes — found in: / no]

## PHASE 5: FIX OPTIONS

  KELAR FIX OPTIONS
  ─────────────────
  Option A: [description] — Pros: / Cons: / Risk: low|medium|high
  Option B: [description] — Pros: / Cons: / Risk: low|medium|high
  Recommended: [A/B] because [reason]

STOP. Wait for user to choose.

## PHASE 6: EXECUTE + VERIFY

  KELAR FIX APPLIED
  ─────────────────
  Fixed in     : [file:line]
  Root cause   : addressed ✓
  Impact check : [clean / regression in X]
  Code quality : passed ✓

## NEVER
- Fix symptom without root cause
- Add null checks to silence errors
- Wrap in try/catch to hide errors
- Apply a fix without understanding why it works
`,

    'consistency-guard': `---
name: consistency-guard
description: >
  Activate for UI components, new modules, new files in existing layers, or when
  user asks to match/follow/be consistent with existing style.
  Triggers on: "component", "UI", "design", "style", "layout", "page", "screen"
---

# KELAR Skill: Consistency Guard

Every new piece must look and feel like it was always there.

## PHASE 1: PATTERN SCAN

For UI:
  Ref files   : [2-3 most similar components]
  Spacing     : [values in use]
  Colors      : [tokens in use]
  Components  : [structure pattern]
  States      : [loading/error/empty patterns]
  Icons       : [library in use]
  Animation   : [transition values]

For Backend:
  Ref files   : [existing modules in same layer]
  Functions   : [signature pattern]
  Returns     : [what functions return]
  Errors      : [how errors are thrown]
  Exports     : [module export pattern]
  Naming      : [how similar things are named]

## PHASE 2: MAP

  KELAR CONSISTENCY MAP
  ─────────────────────
  Building   : [what you're creating]
  Matches    : [reference file]
  Will reuse : [existing utilities/components]
  Will NOT invent: [things that already exist]

## PHASE 3: DEVIATION ALERT

If REQUIRED to deviate:
  KELAR DEVIATION ALERT
  ─────────────────────
  Pattern  : [what needs to change]
  Reason   : [why existing doesn't work]
  Proposal : [new pattern]
  Impact   : [affects other files?]
  Approve deviation? (yes/no)

Do NOT deviate without explicit approval.

## PHASE 4: VERIFICATION

UI:
[ ] Only existing color tokens (no new hex/rgb)
[ ] Existing spacing scale (no arbitrary values)
[ ] Component structure matches reference
[ ] Loading/error/empty states match existing
[ ] Responsive behavior matches

Backend:
[ ] Function signatures match layer conventions
[ ] Return types consistent with similar functions
[ ] Error types match existing error system
[ ] Exports match existing pattern
`,

    'safe-execution': `---
name: safe-execution
description: >
  Activate before multi-file changes, refactors, HIGH risk impact radar results,
  operations on core/shared files, or any change that could be hard to reverse.
  Triggers on: multi-file changes, refactors, "update all", core file modifications.
---

# KELAR Skill: Diff Preview + Rollback Checkpoint

See before you apply. Undo in seconds if needed.

## PHASE 1: ROLLBACK CHECKPOINT

Before ANY significant change:
  git add -A && git stash push -m "kelar-checkpoint-[timestamp]-before-[task-slug]"

  KELAR CHECKPOINT CREATED
  ─────────────────────────
  Checkpoint: kelar-checkpoint-[timestamp]-before-[task]
  Rollback  : git stash pop

## PHASE 2: DIFF PREVIEW

Show diff BEFORE applying:

  KELAR DIFF PREVIEW
  ──────────────────
  File: src/services/UserService.ts
  - [old line]
  + [new line]

  Summary: [N] files, [+lines] added, [-lines] removed

  Apply? (yes / edit / no)

Wait for explicit approval before writing to disk.

## PHASE 3: APPLY + VERIFY

After approval:
1. Apply changes
2. Quick sanity check: npx tsc --noEmit 2>&1 | head -20

  KELAR APPLIED
  ─────────────
  Applied    : ✓
  Type check : PASSED / FAILED — [errors]

If type check fails → offer immediate rollback.

## /kelar:rollback

  Available checkpoints:
  1. kelar-checkpoint-[timestamp]-before-[task] (most recent)
  Roll back to which? (1 / cancel)

## ADAPTIVE
Quick task (1 file, small): skip — just apply and show what changed after.
Medium (2-5 files): checkpoint + diff summary.
Large/risky (5+ files, core): checkpoint + full diff + require "yes" + type check.
`,
  };
}

// ─── Workflows ───────────────────────────────────────────────────────────────

function getWorkflows(config) {
  const commit = config.autoCommit === 'auto'
    ? 'Auto-commit after each micro-task: git add [changed files] && git commit -m "feat(kelar): [task description]"'
    : config.autoCommit === 'ask'
    ? 'Ask user before committing each micro-task.'
    : 'Do not auto-commit. User commits manually.';

  return {
    'map.md': `# KELAR Workflow: /kelar:map

Analyze existing codebase before any work begins.
Usage: /kelar:map [area?]

## STEPS

1. Read top-level folder structure
2. Identify layers (routes → controllers → services → repositories)
3. Find 3-5 representative files per layer
4. Extract: naming, imports/exports, error handling, async pattern
5. If frontend: find design tokens, component library, state management
6. Identify entry points + config files

## OUTPUT → .kelar/state/STATE.md

\`\`\`markdown
# Project State
Last mapped: [timestamp]

## Architecture
Type : [fullstack/backend/frontend/CLI]
Stack: [technologies]
Layers: [layer → folder → responsibility]

## Conventions
Naming    : [patterns]
Async     : [pattern]
Errors    : [pattern]
Exports   : [pattern]
UI Tokens : [if applicable]

## Key Files
[file] — [why important]

## Anti-Patterns Found
[pattern to avoid] — reason: [why]
\`\`\`

## OUTPUT TO USER

  KELAR MAP COMPLETE
  ──────────────────
  Stack mapped   : [stack]
  Layers         : [N]
  Patterns found : [N]
  Anti-patterns  : [N]

  Ready for: /kelar:feature or /kelar:fix
`,

    'feature.md': `# KELAR Workflow: /kelar:feature

Build a new feature end-to-end.
Usage: /kelar:feature [brief description]

## FLOW
BRIEF → EXPLORE → PLAN → APPROVE → EXECUTE (waves) → VERIFY

${commit}

## STEP 1: BRIEF

Ask:
1. What does this feature do? (one sentence)
2. Who uses it? What triggers it?
3. Input/Output shape?
4. Edge cases?
5. What is explicitly OUT of scope?

  KELAR FEATURE BRIEF
  ───────────────────
  Feature     : [name]
  Goal        : [one sentence]
  Triggered by: [action/event]
  Input       : [data in]
  Output      : [result]
  Edges       : [list]
  Out of scope: [list]

Save to .kelar/state/STATE.md under ## Current Feature.

## STEP 2: EXPLORE
Run pre-execution skill Phase 1+2.
Run consistency-guard skill Phase 1+2.

## STEP 3: PLAN

Group into waves:

  KELAR FEATURE PLAN
  ──────────────────
  WAVE 1 — Foundation
  [ ] 1.1 [task] in [file] → done when: [condition]

  WAVE 2 — Core Logic
  [ ] 2.1 [task] in [file] → done when: [condition]

  Files to modify: [list]
  Files to create: [list]

STOP. Wait for user approval or edits.

## STEP 4: EXECUTE

For each micro-task:
1. Implement
2. Code-quality self-check
3. Mark in .kelar/state/TASKS.md: [x] [timestamp] [task] — DONE
4. ${commit}

After each wave:
  KELAR WAVE [N] COMPLETE
  ───────────────────────
  Completed: [list]
  Next wave: [list]
  Continue? (yes/no)

## STEP 5: VERIFY

  KELAR VERIFY
  ────────────
  [ ] Core functionality implemented
  [ ] All edge cases handled
  [ ] Error handling in place
  [ ] UI consistent (if applicable)
  [ ] Zero hardcoded values
  [ ] Nothing outside scope was modified
  [ ] TASKS.md updated

## DONE → append to .kelar/state/STATE.md
  ## Completed: [Feature] — [date]
  - Implemented: [summary]
  - Files modified: [list]
  - Decisions: [any architectural decisions]
`,

    'fix.md': `# KELAR Workflow: /kelar:fix

Debug and fix a bug with root cause analysis.
Usage: /kelar:fix [description or paste error]

## FLOW
INTAKE → TRACE → ROOT CAUSE → IMPACT → OPTIONS → APPROVE → FIX → VERIFY

${commit}

## STEPS

1. Run deep-debug skill — full protocol
2. Present 2-3 fix options, wait for user to choose
3. Apply fix — scope-guarded
4. Verify root cause addressed (not just symptom)
5. Run code-quality self-check
6. ${commit}

## DONE → append to .kelar/state/STATE.md
  ## Fix: [Error] — [date]
  - Root cause: [one sentence]
  - Fixed in: [file:line]
  - Regression: none / [what was affected]
`,

    'quick.md': `# KELAR Workflow: /kelar:quick

Small focused task with full guardrails, no heavy planning.
Usage: /kelar:quick [task description]

Examples: "add loading spinner", "rename function X", "add email validation"

## USE QUICK WHEN
- Max 1-3 files
- One focused action
- No new architecture decisions
- Low regression risk

## ESCALATE TO /kelar:feature WHEN
- 4+ files
- New patterns or architecture decisions needed
- Significant regression risk

## FLOW

1. SCAN: read the file(s) to be modified, identify patterns

2. CONFIRM:
     KELAR QUICK
     ───────────
     Task    : [what]
     File(s) : [where]
     Approach: [how]
     Proceed? (yes/no)

3. EXECUTE: implement, follow all code-quality rules, no scope creep

4. DONE:
     KELAR QUICK DONE
     ─────────────────
     Done  : [what changed]
     File  : [file:line]
     Check : code quality passed ✓

5. ${commit}

Update .kelar/state/TASKS.md: [x] [timestamp] quick: [task] — DONE

## NOTE
All rules still apply: zero hardcode, scope guard, consistency.
Out-of-scope observations → .kelar/state/DEBT.md, never silent fixes.
`,

    'pause-resume.md': `# KELAR Workflow: /kelar:pause & /kelar:resume

Session continuity — never lose context.

---

# /kelar:pause

Usage: /kelar:pause
Use when: stopping work, context limit approaching, switching sessions.

## STEPS

1. Read .kelar/state/TASKS.md and .kelar/state/STATE.md
2. Identify last completed micro-task and next pending task
3. Write .kelar/state/HANDOFF.md:

\`\`\`markdown
# KELAR HANDOFF
Generated: [timestamp]

## Status
Last completed : [micro-task] in [file]
Next task      : [exact next micro-task]
Wave           : [N] of [total]
Progress       : [N/total] tasks complete

## Context
Feature/Fix : [what's being worked on]
Goal        : [one sentence]
Approach    : [chosen approach]

## Files Modified So Far
- [file] — [what changed]

## Files Pending
- [file] — [what needs to happen]

## Open Decisions
- [anything unresolved]

## How To Resume
1. Read this file
2. Read .kelar/state/STATE.md
3. Run /kelar:resume
\`\`\`

4. Write session entry to .kelar/state/DIARY.md:
\`\`\`markdown
## [Date] [Time]
Worked on: [feature/fix]
Completed: [bullet list]
Decisions: [any pattern decisions made]
Debt logged: [DEBT.md additions]
Next: [exact next task]
\`\`\`

Output:
  KELAR PAUSED
  ────────────
  Saved : .kelar/state/HANDOFF.md
  Logged: .kelar/state/DIARY.md
  Next  : [next task]
  Resume: /kelar:resume

---

# /kelar:resume

Usage: /kelar:resume
Use when: starting new session, switching models, returning after break.

## STEPS

1. Read .kelar/state/HANDOFF.md
2. Read .kelar/state/STATE.md
3. Read .kelar/state/TASKS.md

Output:
  KELAR RESUMED
  ─────────────
  Working on : [feature/fix]
  Progress   : [N/total] tasks
  Last done  : [last task]
  Up next    : [next task]
  Open items : [any open decisions]

  Proceed with: [next task]? (yes/no)

Wait for confirmation before executing.

## IF HANDOFF.md MISSING
Check STATE.md and TASKS.md directly.
If neither exists → ask: "What were we working on? I'll reconstruct context."
`,

    'status.md': `# KELAR Workflow: /kelar:status

View current progress and what's next.
Usage: /kelar:status

## READS
.kelar/state/TASKS.md + .kelar/state/STATE.md + .kelar/state/HANDOFF.md (if exists)

## OUTPUT

  KELAR STATUS
  ────────────
  Working on  : [feature/fix or "nothing active"]
  Progress    : [N/total] tasks ([%]%)

  COMPLETED
  [x] [task 1]
  [x] [task 2]

  ← YOU ARE HERE →
  [ ] [current task]

  UPCOMING
  [ ] [next]
  [ ] [after]

  OPEN DECISIONS
  - [waiting for user input]

  NEXT ACTION
  → [exact next step]

## KELAR NOTICES (if any)

  Deferred observations:
  - [file]: [issue] → /kelar:quick [suggested fix]
  Address these? (yes/skip)
`,
  };
}

// ─── State files ─────────────────────────────────────────────────────────────

function getStateFiles(config) {
  const ts = new Date().toISOString().split('T')[0];
  return {
    'STATE.md': `# Project State
> Managed by KELAR. Never delete this file.
Last updated: ${ts}

## Architecture
> Populated by /kelar:map

Type  : [not yet mapped — run /kelar:map]
Stack : []
Layers: []

## Conventions
> Populated by /kelar:map

## Current Feature
Working on  : nothing
Progress    : 0/0

## Decisions Made
> Append-only.

## Completed Work
> Append-only.

## Anti-Patterns
> Things learned NOT to do in this codebase.
`,

    'TASKS.md': `# KELAR Tasks
> Micro-task tracker. Updated after every completed task.
Last updated: ${ts}

## Active
None

## Micro-Tasks
> Populated by /kelar:feature or /kelar:fix

## Completed (append-only)
> [x] [timestamp] [task] — DONE

## KELAR Notices (deferred)
> [file]: [observation] → /kelar:quick [fix]
`,

    'PATTERNS.md': `# KELAR Pattern Memory
> Append-only. AI reads this every session — these decisions are permanent.
Last updated: ${ts}

## How This Works
- Every approved architectural decision is logged here
- AI checks this before making ANY pattern decision
- If found → apply silently, don't ask again
- If not found → ask once, then log forever

## Approved Patterns
> Will populate during development.

## Categories (fill as decisions are made)
- [ ] Error handling
- [ ] API response shape
- [ ] Async pattern
- [ ] Type definitions
- [ ] Import order
- [ ] State management
- [ ] Component structure
- [ ] Testing approach
- [ ] Logging style
- [ ] Environment variable access
`,

    'ASSUMPTIONS.md': `# KELAR Assumption Log
> Every assumption AI makes is logged here until verified.
Last updated: ${ts}

## Active (Unverified)
> None yet.

## Verified
| Date | Assumption | Verified As |
|------|------------|-------------|

## Corrected
| Date | Original | Actual | Impact |
|------|----------|--------|--------|
`,

    'DEBT.md': `# KELAR Tech Debt
> Append-only. Out-of-scope observations logged here for later.
Last updated: ${ts}

## Priority: 🔴 HIGH · 🟡 MEDIUM · 🟢 LOW

## Active
| # | Date | File | Issue | Priority | Est. Fix |
|---|------|------|-------|----------|----------|

## Resolved
| # | Found | Fixed | Issue | How |
|---|-------|-------|-------|-----|

## Systemic Issues (3+ same type → become a Rule)
| Category | Count |
|----------|-------|
| Hardcoded values | 0 |
| Missing error handling | 0 |
| N+1 queries | 0 |
| Inconsistent naming | 0 |
`,

    'DIARY.md': `# KELAR Session Diary
> Auto-written on /kelar:pause. Append-only.
Last updated: ${ts}

---

## Entry Format
\`\`\`
## [Date] [Time]
Worked on: [feature/fix]
Completed: [bullet list]
Decisions: [pattern decisions → PATTERNS.md]
Debt     : [DEBT.md additions]
Next     : [exact next task]
Mood     : [codebase assessment]
\`\`\`

---

> Sessions will appear here.
`,
  };
}

module.exports = { getRules, getSkills, getWorkflows, getStateFiles };
