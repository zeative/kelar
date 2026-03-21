---
name: pre-execution
description: >
  Handles planning and exploration before any code is written. Activate when
  user asks to build, implement, create, add, make, write, update, or change
  anything in the codebase. Do not write any code until this skill completes.
  Triggers on: "build", "create", "implement", "add", "make", "write", "update", "change"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
---

# Pre-Execution Protocol

**NO CODE IS WRITTEN WITHOUT AN APPROVED PLAN.**
This is not a guideline. It is a hard gate. The gate does not open without explicit user approval.

---

## PHASE 1: MANDATORY FILE EXPLORATION

Do not skip this. Do not rush this. This is where you earn the right to write code.

### Step 1.1 — Find the layer
```bash
# Where does this code belong?
ls src/
ls src/services/ src/components/ src/routes/ src/utils/ 2>/dev/null | head -20
```

### Step 1.2 — Find similar files
```bash
# For a service
find src/ -name "*Service*" -o -name "*service*" 2>/dev/null | head -10

# For a component
find src/ -name "*.tsx" -o -name "*.jsx" 2>/dev/null | head -10

# For an API route
find src/ -path "*/routes/*" -o -path "*/api/*" 2>/dev/null | head -10

# For a utility
find src/ -path "*/utils/*" -o -path "*/helpers/*" 2>/dev/null | head -10
```

### Step 1.3 — Read reference files
Read the 2-3 files MOST similar to what you're building. Do not skim. Read completely.

Extract:
```
KELAR EXPLORE
─────────────
Files read     : [exact file paths]

Structure      : [how files are organized — top-level imports, exports, etc.]
Naming         : [exact naming patterns — file names, function names, variables]
Async pattern  : [async/await / Promise.then / callbacks — which one?]
Error handling : [try-catch / Result type / throw / return error object?]
Import style   : [relative: '../utils' / alias: '@/utils' / absolute?]
Export style   : [export default / named exports / module.exports?]
Types          : [TypeScript interfaces / types / PropTypes / JSDoc?]
Test pattern   : [test files location / naming / framework if visible]

Reusable code  : [list existing utilities/components you WILL reuse]
Anti-patterns  : [things you saw in reference files NOT to copy]
```

**If you cannot find reference files → say so explicitly. Do not invent patterns.**

---

## PHASE 2: UNDERSTAND THE TASK PRECISELY

Do not assume. Do not fill gaps silently. Clarify first.

```
KELAR UNDERSTAND
────────────────
Goal         : [ONE sentence — what does this accomplish for the user?]
Input        : [what data comes in? type? format? source?]
Output       : [what comes out? type? format? destination?]
Side effects : [what else changes when this runs?]
Error cases  : [what can go wrong? what happens when it does?]
Out of scope : [explicitly state what you will NOT do]
```

**If anything in this template is unclear → ask ONE specific question before continuing.**

Example of a good clarifying question:
> "The task mentions 'save user settings' — should this be stored in the database (UserSettings table) or in localStorage? I see both patterns in the codebase."

Example of a bad clarifying question:
> "Can you tell me more about what you want?"

---

## PHASE 3: ATOMIC MICRO-TASK PLAN

Break the work into the smallest possible units. Each unit = 1 responsibility, max 1-2 files, clear done condition.

```
KELAR PLAN
──────────
Task: [feature/fix name]

WAVE 1 — Foundation (run first, everything else depends on this)
[ ] 1.1 [specific action verb] [specific target] in [specific file]
         Done when: [concrete verifiable condition]
         Risk: LOW / MEDIUM / HIGH
         
[ ] 1.2 [specific action verb] [specific target] in [specific file]
         Done when: [concrete verifiable condition]
         Risk: LOW / MEDIUM / HIGH

WAVE 2 — Core Logic (depends on Wave 1 being complete)
[ ] 2.1 [specific action verb] [specific target] in [specific file]
         Done when: [concrete verifiable condition]
         Risk: LOW / MEDIUM / HIGH

WAVE 3 — Integration + Verification
[ ] 3.1 [specific action verb] [specific target] in [specific file]
         Done when: [concrete verifiable condition]
         Risk: LOW / MEDIUM / HIGH
[ ] 3.2 Verify: [how will we know everything works together?]

Files to MODIFY : [exact list]
Files to CREATE : [exact list]
Files UNTOUCHED : everything else

Approach chosen:
  A) [approach] — Pros: / Cons: / Why chosen / not chosen
  B) [approach] — Pros: / Cons: / Why chosen / not chosen
Recommended: [A/B] because [specific technical reason]
```

### What makes a good micro-task?

✓ "Create `UserService.getById(id: string): Promise<User>` in `src/services/UserService.ts` — Done when: function returns User or throws NotFoundError"

❌ "Build the user service" — too vague, no done condition

✓ "Add `isLoading` and `error` state to `UserForm.tsx` component — Done when: spinner shows during submit, error message shows on failure"

❌ "Make the form work better" — means nothing

---

## PHASE 4: MANDATORY APPROVAL GATE

```
KELAR READY
───────────
Plan is ready. 

Summary:
  Tasks   : [N total across N waves]
  Files   : [N to modify, N to create]  
  Risk    : [overall LOW/MEDIUM/HIGH]
  Est.    : [rough estimate — tiny/small/medium/large]

Waiting for your approval to begin.
Type:
  "yes" — execute as planned
  "adjust [what]" — modify the plan
  "no" — cancel
```

**DO NOT WRITE ANY CODE UNTIL THE USER TYPES "yes" OR EQUIVALENT APPROVAL.**

"Equivalent approval" = "go", "do it", "start", "looks good", "proceed"

"Not approval" = reading the plan in silence, not responding yet

---

## PHASE 5: EXECUTION PROTOCOL

For each micro-task, follow this exact sequence:

**5.1** Announce which task you're starting:
> "Starting task 1.1: [description]"

**5.2** Implement the task
- Follow patterns from Phase 1 EXACTLY
- Apply all code-quality rules
- Do not exceed scope of this single micro-task

**5.3** Self-check (silent, but mandatory):
- [ ] Zero hardcoded values
- [ ] Naming matches codebase
- [ ] Error handling present
- [ ] No scope creep
- [ ] Patterns match reference files

**5.4** Report completion:
> "Task 1.1 done ✓ [one sentence about what was created/changed]"

**5.5** Update `.kelar/state/TASKS.md`:
```
[x] [timestamp] 1.1 [description] — DONE
```

**5.6** Proceed to next task or wave checkpoint.

### Wave Checkpoint
After completing a wave:
```
KELAR WAVE [N] COMPLETE
───────────────────────
Completed this wave:
  ✓ [task 1.1]
  ✓ [task 1.2]

Next wave: [Wave N+1 title]
  [ ] [task list]

Continue? (yes/no — or adjust next wave)
```

---

## COMMON FAILURE MODES — WATCH FOR THESE

### Failure: Writing code before exploring
Symptom: You start coding immediately after reading the task
Fix: Force yourself to run the bash commands in Phase 1 first

### Failure: Vague done conditions
Symptom: "Done when: implemented" or "Done when: working"
Fix: Always answer: "What specific behavior can I observe to confirm this is done?"

### Failure: Wave 1 has too many tasks
Symptom: Wave 1 has 6+ items
Fix: Wave 1 should be the absolute minimum — usually 1-2 foundation items

### Failure: Plan approved but scope expands during execution
Symptom: You realize mid-task that you need to modify a file not in the plan
Fix: STOP. State the scope change. Get re-approval. Do not silently expand.

### Failure: Waiting for approval but proceeding anyway
Symptom: User hasn't responded yet but you start coding "to save time"
Fix: Wait. Always. The approval gate exists for a reason.
