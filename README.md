<div align="center">

# **KELAR**

<br/>

**Kept Efficient, Logical, Atomic, Resilient**

*The AI execution system for developers who are done babysitting.*

[![npm](https://img.shields.io/npm/v/kelar-cli?style=flat-square&color=000)](https://npmjs.com/package/kelar-cli)
[![license](https://img.shields.io/badge/license-MIT-000?style=flat-square)](./LICENSE)
[![works with](https://img.shields.io/badge/works%20with-Antigravity%20·%20Claude%20Code%20·%20Cursor-000?style=flat-square)](.)

<br/>

> **"You don't vibe code. You KELAR it."**
>
> *"Lo nggak asal vibe coding. Lo KELAR-in."*

<br/>

[Why KELAR](#why-kelar) · [Install](#install) · [Commands](#commands) · [How It Works](#how-it-works) · [File Structure](#file-structure) · [Philosophy](#philosophy)

</div>

---

## Why KELAR

KELAR is a layer of rules, skills, and workflows that sits on top of your AI coding agent — Antigravity, Claude Code, or Cursor — and makes it behave like a senior developer instead of an unpredictable intern.

It reads your codebase before touching it. It makes a plan and waits for your approval. It never touches files outside its scope. And when your session breaks mid-task, it picks up exactly where it left off.

> *"You describe what you want. KELAR handles the rest."*

---

## The problem

AI coding tools fail in predictable ways.

You ask for a feature. It modifies files you didn't mention, hardcodes your secrets, ignores the patterns you've established, and ships something that technically runs but isn't yours. You ask it to fix a bug. It wraps the symptom in a try-catch. You hit a context limit, open a new chat, and it greets you like a stranger.

The result: instead of building, you're reviewing every line, re-explaining your architecture, and cleaning up the mess. You're not using AI — you're supervising it.

---

## Install

```bash
npx kelar-cli@latest init
```

Your preferences are saved to `~/.kelar/config.json` and reused next time.

### Manual Install

```bash
# Antigravity (local)
cp -r .kelar/.agent /your-project/.agent

# Claude Code (local)
cp -r .kelar/.claude /your-project/.claude

# Global (all projects)
cp -r .kelar/.agent ~/.agent
```

---

## First Run

```bash
/kelar:map
```

Run **once** on any existing project. AI scans your entire codebase and writes a comprehensive architecture map — structure, conventions, patterns, anti-patterns — to `.kelar/state/STATE.md`. After this, KELAR knows your project cold.

> 💡 **Indo:** Jalankan `/kelar:map` sekali. AI scan codebase lo, tulis peta arsitektur ke `.kelar/state/STATE.md`. Setelah itu AI ngerti project lo sebelum ngapa-ngapain.

---

## Commands

| Command | What It Does | Use When |
|---------|-------------|----------|
| `/kelar:map` | Scan + understand codebase | First time, or after major restructure |
| `/kelar:feature [desc]` | Build a feature end-to-end | Any new functionality |
| `/kelar:fix [error/desc]` | Debug + fix with root cause analysis | Errors, unexpected behavior |
| `/kelar:quick [desc]` | Small focused task | 1–3 file changes |
| `/kelar:pause` | Save full state | Context limit, end of session |
| `/kelar:resume` | Restore from checkpoint | New session, model switch |
| `/kelar:status` | View current progress | "Where were we?" |

---

## How It Works

Three layers. Each one doing a different job.

```
┌──────────────────────────────────────────────────────────┐
│  LAYER 3 · WORKFLOWS                                     │
│  /kelar:feature  /kelar:fix  /kelar:quick  ...           │
│  Structured flows with mandatory human approval gates    │
├──────────────────────────────────────────────────────────┤
│  LAYER 2 · SKILLS                                        │
│  Auto-triggered protocols based on task context          │
│  pattern-memory · reasoning-quality · impact-radar       │
│  execution-efficiency · deep-debug · safe-execution      │
├──────────────────────────────────────────────────────────┤
│  LAYER 1 · RULES                                         │
│  Always-on guardrails — every task, zero exceptions      │
│  code-quality · scope-guard · consistency                │
└──────────────────────────────────────────────────────────┘
              reads/writes
┌──────────────────────────────────────────────────────────┐
│  .kelar/state/   — living memory across all sessions     │
│  STATE · TASKS · PATTERNS · ASSUMPTIONS · DEBT · DIARY  │
└──────────────────────────────────────────────────────────┘
```

---

### Layer 1 — Rules (Always Active)

Run on every single task. Silently. Non-negotiable.

**`code-quality`**
Zero hardcode. Scan before write. Max 20 lines per function. Error handling mandatory. Self-check before done. Auto-commit behavior based on your preference.

**`scope-guard`**
Touch only what you're asked to touch. Out-of-scope issues → logged to `.kelar/state/DEBT.md`, never silently "fixed". You are a surgeon, not a janitor.

**`consistency`**
Pattern hierarchy: same file → same layer → codebase → industry standard. Deviations require explicit approval.

---

### Layer 2 — Skills (On-Demand)

Auto-triggered by context. Lightweight for small tasks, thorough for big ones.

**🧠 `pattern-memory`** — Approved once. Applied forever.
Stores every architectural decision in `.kelar/state/PATTERNS.md`. Read every session. AI never asks the same question twice.

**🦆 `reasoning-quality`** — Think before building.
Rubber duck (explain the approach) + Devil's advocate (attack your own plan) before any complex task. Only when it matters.

**📡 `impact-radar`** — Know your blast radius.
Scans all dependents before modifying any existing file. Generates a Before/After Contract — the exact definition of done.

**⚡ `execution-efficiency`** — Scripts beat manual edits.
1–3 files: manual. 3–10 files, same pattern: CLI one-liner. 10+ files: generated script. Recurring task: code generator. All scripts saved to `.kelar/scripts/`.

**🔍 `pre-execution`** — Explore → Plan → Approve → Execute.
No code written without a plan you've approved. Reads files, extracts patterns, breaks task into atomic micro-tasks, waits for your go.

**🐛 `deep-debug`** — Root cause, not symptom.
Traces 3+ levels deep. Presents 2–3 fix options. Never patches symptoms.

**🎨 `consistency-guard`** — Looks like it was always there.
Scans existing components before creating new ones. Flags deviations before they're written.

**🛡️ `safe-execution`** — See it before it happens.
Git checkpoint before significant changes. Diff preview before apply. Instant rollback available.

---

### Layer 3 — Workflows

#### `/kelar:feature`

```
BRIEF → EXPLORE → PLAN → YOU APPROVE → EXECUTE (waves) → VERIFY
```

Work is grouped into **waves** — sequential batches of atomic micro-tasks. Every task tracked in `.kelar/state/TASKS.md`. Auto-commits based on your configured preference.

```
WAVE 1 · Foundation     WAVE 2 · Core Logic     WAVE 3 · Integration
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ [x] 1.1 Schema   │    │ [ ] 2.1 Service   │    │ [ ] 3.1 Route    │
│ [x] 1.2 Types    │──► │ [ ] 2.2 Repo      │──► │ [ ] 3.2 Verify   │
└──────────────────┘    └──────────────────┘    └──────────────────┘
      complete               up next                  pending
```

#### `/kelar:fix`

```
INTAKE → TRACE (3+ levels) → ROOT CAUSE → IMPACT → OPTIONS → YOU CHOOSE → FIX
```

You always choose the fix approach. Contract verified on completion.

#### `/kelar:quick`

Small tasks. Full guardrails, no heavy planning. Still self-checks. Still commits.

---

## Session Continuity

Built for real-world constraints — free tier limits, context windows, model switches.

```
Limit approaching
      │
      ▼
/kelar:pause
  ├── .kelar/state/HANDOFF.md  ← exact checkpoint
  ├── .kelar/state/TASKS.md    ← full progress
  └── .kelar/state/DIARY.md    ← session summary
      │
      ▼
New session — any model
      │
      ▼
/kelar:resume
  └── "Continue from: task 2.1 (Service layer)?"
      │
      ▼
Zero context lost. Exactly where you left off.
```

> 💡 **Indo:** Sering kena limit atau harus ganti model? `/kelar:pause` sebelum konteks habis. `/kelar:resume` di sesi baru. Ga ada yang ilang.

---

## State Files

Everything KELAR generates lives in `.kelar/state/` — never in your project root. Your codebase stays clean.

| File | Tracks | Updated by |
|------|--------|------------|
| `STATE.md` | Architecture, conventions, history | `/kelar:map`, decisions |
| `TASKS.md` | Active micro-task tracker | Every completed task |
| `PATTERNS.md` | Approved architectural decisions (permanent) | Every approval |
| `ASSUMPTIONS.md` | Pending + verified assumptions | Every assumption |
| `DEBT.md` | Tech debt log — priority + time estimate | Every out-of-scope observation |
| `DIARY.md` | Session history | Every `/kelar:pause` |
| `HANDOFF.md` | Resume checkpoint | Every `/kelar:pause` |

All files are **append-only**. Full project memory, always intact.

---

## File Structure

```
your-project/
│
├── .kelar/                              ← everything KELAR lives here
│   ├── rules/
│   │   ├── code-quality.md             # zero hardcode, clean code, auto-commit
│   │   ├── scope-guard.md              # surgical scope
│   │   └── consistency.md              # mirror existing patterns
│   │
│   ├── skills/
│   │   ├── pattern-memory/SKILL.md
│   │   ├── reasoning-quality/SKILL.md
│   │   ├── impact-radar/SKILL.md
│   │   ├── execution-efficiency/SKILL.md
│   │   ├── pre-execution/SKILL.md
│   │   ├── deep-debug/SKILL.md
│   │   ├── consistency-guard/SKILL.md
│   │   └── safe-execution/SKILL.md
│   │
│   ├── workflows/
│       ├── kelar-map.md
│       ├── kelar-feature.md
│       ├── kelar-fix.md
│       ├── kelar-quick.md
│       ├── kelar-pause.md
│       └── kelar-resume.md
│   │
│   ├── state/                           ← auto-managed, never edit manually
│   │   ├── STATE.md
│   │   ├── TASKS.md
│   │   ├── PATTERNS.md
│   │   ├── ASSUMPTIONS.md
│   │   ├── DEBT.md
│   │   ├── DIARY.md
│   │   └── HANDOFF.md
│   │
│   └── scripts/                         ← generated CLI scripts
│
├── your-source-code/                    ← untouched by KELAR internals
└── ...
```

---

## Configuration

Your preferences live at `~/.kelar/config.json`:

```json
{
  "agents": ["antigravity", "claude"],
  "scope": "local",
  "autoCommit": "auto",
  "commitKelar": "no-state",
  "language": "en"
}
```

Re-run `npx kelar-cli@latest init` anytime to update preferences.

**`autoCommit`** options:
- `"auto"` — commit after every micro-task automatically
- `"ask"` — prompt before each commit  
- `"off"` — manual commits only

**`commitKelar`** options:
- `"all"` — commit everything (share with team)
- `"no-state"` — commit rules/skills, ignore `.kelar/state/` (recommended)
- `"none"` — add all of `.kelar/` to `.gitignore`

---

## Philosophy

Five principles. No exceptions.

1. **Plan before code** — AI never writes a line without an approved plan. The gate is mandatory.
2. **Atomic tasks** — Every unit of work is small enough to verify, track, and revert independently.
3. **Append-only memory** — State files are never overwritten. History is permanent.
4. **Explicit over implicit** — AI states what it will do. You approve. Then it does it.
5. **Surgical scope** — AI operates only on what it's asked to operate on. Precision over convenience.

---

## Compatibility

| Agent | Support | Install Path |
|-------|---------|-------------|
| Antigravity | ✅ Full | `.agent/` |
| Claude Code | ✅ Full | `.claude/` |
| Cursor | ✅ Rules | `.cursor/rules/` |
| Windsurf | ✅ Rules | `.windsurf/rules/` |

---

## Contributing

Does this make AI more precise, more consistent, or more resilient? If yes, it belongs in KELAR. PRs welcome.

---

## License

MIT — use it, fork it, improve it, ship it.

---

<div align="center">

<br/>

```
Built by developers who hired AI to do the work,
then spent twice as long managing the AI.
```

*Dibuat oleh developer yang hire AI buat kerja, lalu habiskan dua kali lebih banyak waktu buat ngatur AI-nya.*

<br/>

```bash
npx kelar-cli@latest init
```

</div>
