# KELAR Workflow: /kelar:map

**Trigger:** First time using KELAR on an existing project, or when codebase has significantly changed.
**Usage:** `/kelar:map`

---

## WHAT THIS DOES

Analyzes the existing codebase and writes a comprehensive architecture map to .kelar/state/STATE.md.
After running this, AI will deeply understand the project before any task.

---

## MAP STEPS

### 1. STRUCTURE SCAN
- Read top-level folder structure
- Identify what each folder is responsible for
- Map the layer architecture (e.g., routes → controllers → services → repositories)

### 2. PATTERN EXTRACTION
- Find 3-5 representative files per layer
- Extract naming conventions
- Extract how imports/exports are structured
- Extract error handling pattern
- Extract async pattern (async/await vs promises)
- Extract how types/interfaces are defined

### 3. UI PATTERN EXTRACTION (if frontend exists)
- Find existing components
- Extract design tokens / CSS variables
- Identify component library in use
- Extract state management pattern
- Extract how API calls are made from frontend

### 4. ENTRY POINTS
- Identify main entry files
- Identify config files
- Identify env variables in use

---

## OUTPUT — Written to .kelar/state/STATE.md

```markdown
# Project State
Last mapped: [timestamp]

## Architecture
Type: [fullstack / backend / frontend / CLI / etc]
Stack: [list main technologies]

Layers:
  [layer name] → [folder] → [responsibility]
  [layer name] → [folder] → [responsibility]

Entry points:
  [file] — [purpose]

## Conventions

### Naming
  Files     : [pattern — e.g. camelCase, kebab-case]
  Functions : [pattern]
  Variables : [pattern]
  Types     : [pattern]
  Components: [pattern]

### Code Patterns
  Async     : [pattern in use]
  Errors    : [how errors are thrown/caught]
  Exports   : [default vs named, barrel files, etc]
  Imports   : [order, aliasing]

### UI Patterns (if applicable)
  Components  : [structure pattern]
  Styling     : [CSS modules / Tailwind / styled-components / etc]
  State       : [local state / context / redux / zustand / etc]
  API calls   : [how frontend calls backend]
  Loading     : [how loading states are shown]
  Errors      : [how errors are displayed]
  Empty states: [how empty states are shown]

## Key Files
  [file] — [why it's important]
  [file] — [why it's important]

## Anti-Patterns Found
  - [any inconsistencies or patterns to avoid]

## Current Feature
[empty — will be filled when work begins]
```

---

## OUTPUT TO USER

```
KELAR MAP COMPLETE
──────────────────
Project type  : [type]
Stack         : [main stack]
Layers mapped : [N layers]
Patterns found: [N patterns documented]
Anti-patterns : [N issues noted]

Full map written to .kelar/state/STATE.md.
KELAR now understands your codebase.

Ready for: /kelar:feature or /kelar:fix
```
