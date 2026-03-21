---
name: kelar:fix
description: Debug and fix bugs with multi-agent root cause analysis. Uses kelar-tools throughout. Debugger → user choice → executor → repair if needed → verifier.
argument-hint: "<error or description>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
---

# /kelar:fix

{{LANGUAGE}}

---

## STEP 0: CONTEXT + MEMORY CHECK

```bash
node .kelar/kelar-tools.cjs health
# Check if this bug is already documented
node .kelar/kelar-tools.cjs memory search "[error keywords]"
```

If memory returns a match → show it to user immediately. The fix might already be known.

```bash
node .kelar/kelar-tools.cjs tasks log fix_start "[error description]"
```

---

## STEP 1: INTAKE

Collect full error. If no stack trace → ask for it before spawning debugger.

```
Error    : [message — exact]
Stack    : [full trace]
Trigger  : [steps to reproduce]
Expected : [should happen]
Actual   : [happens instead]
```

---

## STEP 2: SPAWN DEBUGGER

```
Task(
  subagent_type="general-purpose",
  prompt="""You are kelar-debugger. Analyze this error and find the root cause.

  [paste full intake]

  Check memory for known issues first:
  $(node .kelar/kelar-tools.cjs memory search "[error type keywords]")

  Trace minimum 3 levels deep. Produce:
  1. Root cause in ONE sentence
  2. Blast radius (files affected)
  3. THREE fix options with tradeoffs

  <files_to_read>
  AGENTS.md
  .kelar/state/STATE.md
  .kelar/memory/technical/gotchas.md
  [files from stack trace top 3 frames]
  </files_to_read>"""
)
```

---

## STEP 3: PRESENT OPTIONS

Show debugger's report. Wait for user choice.

```
ROOT CAUSE: [one sentence]

Fix options:
  A) [name] — [what] — Risk: [LOW/MED/HIGH]
  B) [name] — [what] — Risk: [LOW/MED/HIGH]
  C) [name] — [what] — Risk: [LOW/MED/HIGH]

Recommended: [X] — [reason]

Your choice? (A / B / C)
```

---

## STEP 4: CHECKPOINT + EXECUTE

```bash
node .kelar/kelar-tools.cjs git checkpoint
```

Build single-task plan for chosen fix, spawn executor:
```
Task(
  subagent_type="general-purpose",
  prompt="""You are kelar-executor. Apply this bug fix.

  Root cause: [one sentence]
  Fix chosen: [option description]

  <task>
  [single XML task for the fix]
  </task>

  <files_to_read>
  AGENTS.md
  .kelar/state/STATE.md
  [file being fixed]
  </files_to_read>"""
)
```

---

## STEP 5: VERIFY ROOT CAUSE RESOLVED

```
Task(
  subagent_type="general-purpose",
  prompt="""You are kelar-verifier. Verify this fix resolved the ROOT CAUSE.

  Root cause was: [statement]
  Fix applied: [description]

  Confirm root cause is addressed — not just symptom masked.

  <files_to_read>
  [fixed file]
  </files_to_read>"""
)
```

---

## STEP 6: KNOWLEDGE + COMPLETE

If bug revealed a non-obvious gotcha:
```bash
node .kelar/kelar-tools.cjs memory save technical "[bug title]" "[root cause + solution description]"
```

```bash
node .kelar/kelar-tools.cjs tasks log fix_done "[error] — fixed: [root cause summary]"
{{COMMIT_BEHAVIOR}}
```

```
KELAR FIX COMPLETE ✅
─────────────────────
Root cause: [one sentence]
Fixed in  : [file:line]
Verified  : [PASS / issues]
Knowledge : [saved / not needed]
```
