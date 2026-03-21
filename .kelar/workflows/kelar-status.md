---
name: kelar:status
description: Rich project dashboard. Shows active task, progress, recent activity, debt, and memory stats. Uses kelar-tools for fast structured data.
allowed-tools:
  - Bash
  - Read
---

# /kelar:status

{{LANGUAGE}}

```bash
# Collect all data in parallel
SNAPSHOT=$(node .kelar/kelar-tools.cjs state snapshot)
ACTIVE=$(node .kelar/kelar-tools.cjs tasks active)
DEBT=$(node .kelar/kelar-tools.cjs debt list)
PATTERNS=$(node .kelar/kelar-tools.cjs patterns list)
GIT=$(node .kelar/kelar-tools.cjs git status)
HEALTH=$(node .kelar/kelar-tools.cjs health)
```

Present as dashboard:

```
╔══════════════════════════════════════════════════════╗
║              KELAR STATUS DASHBOARD                  ║
╚══════════════════════════════════════════════════════╝

📦 PROJECT
  Stack    : [from snapshot]
  Type     : [from snapshot]

🔄 ACTIVE TASK
  [task name or "idle — awaiting instruction"]
  Status   : [active / paused / idle]
  Next step: [if paused]

📊 PROGRESS
  [progress bar if applicable]
  [N tasks complete this session]

🧠 MEMORY
  Patterns  : [N approved]
  Knowledge : [N entries in memory/]
  Debt items: [N — N HIGH, N MEDIUM, N LOW]

📁 GIT
  Branch   : [branch name]
  Changed  : [N files uncommitted]

⚠ HIGH PRIORITY DEBT
  [list HIGH items if any, max 3]

✅ SYSTEM HEALTH
  [all checks passing / list failures]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT: [suggested action based on current state]
```
