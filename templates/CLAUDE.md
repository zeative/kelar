# CLAUDE.md
> Claude Code specific configuration. Supplements AGENTS.md — read AGENTS.md first.

---

## KELAR FRAMEWORK ACTIVE

You are operating under the KELAR execution framework.
Read AGENTS.md for universal rules. This file contains Claude Code-specific additions only.

---

## SLASH COMMANDS

These commands are available:
- `/kelar:map` — scan and understand codebase (run once per project)
- `/kelar:feature [desc]` — build a feature with full planning gate
- `/kelar:fix [error]` — debug with root cause analysis
- `/kelar:quick [desc]` — small focused task (1-3 files)
- `/kelar:pause` — save session state before stopping
- `/kelar:resume` — restore from last checkpoint
- `/kelar:status` — view current progress

---

## CLAUDE-SPECIFIC BEHAVIOR

### Memory files location
All state: `.kelar/state/`
Knowledge: `.kelar/memory/`
Scripts: `.kelar/scripts/`

### Skills location
`.claude/skills/` (symlinked from `.kelar/skills/`)

### Auto-commit behavior
{{COMMIT_BEHAVIOR}}

---

## IMPORT CHAIN
This file → AGENTS.md → `.kelar/state/STATE.md` → task execution
