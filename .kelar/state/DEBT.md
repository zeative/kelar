# KELAR Tech Debt Tracker
> Append-only. Populated automatically when AI notices issues outside current scope.
> Review this periodically and schedule fixes with /kelar:quick or /kelar:feature.

Last updated: [timestamp]

---

## How This Works

When AI notices something that needs improvement but is OUT OF SCOPE for the current task:
1. It does NOT fix it silently
2. It does NOT ignore it
3. It logs it here with priority + estimated fix time
4. User reviews and schedules when ready

---

## Priority Legend

| Priority | Meaning |
|----------|---------|
| 🔴 HIGH | Security risk, data loss risk, or causes active bugs |
| 🟡 MEDIUM | Performance issue, code smell, inconsistency that will grow |
| 🟢 LOW | Nice-to-have cleanup, minor inconsistency |

---

## Active Debt

| # | Date | File | Issue | Priority | Est. Fix | Fix Command |
|---|------|------|-------|----------|----------|-------------|
| - | - | - | - | - | - | - |

> Will populate during development.

---

## Resolved Debt

| # | Date Found | Date Fixed | File | Issue | How Fixed |
|---|------------|------------|------|-------|-----------|
| - | - | - | - | - | - |

---

## Debt Categories (for tracking patterns)

When the same type of debt appears 3+ times → it's a systemic issue, not a one-off.
Systemic issues should become a new RULE in KELAR rules/.

| Category | Count | Status |
|----------|-------|--------|
| Hardcoded values | 0 | - |
| Missing error handling | 0 | - |
| N+1 queries | 0 | - |
| Inconsistent naming | 0 | - |
| Missing types | 0 | - |
| Dead code | 0 | - |
| Missing validation | 0 | - |
