# KELAR Assumption Log
> Every assumption AI makes gets logged here until verified by the user.
> Unverified assumptions are flagged at the start of every session.

Last updated: [timestamp]

---

## How This Works

When AI lacks information and must assume something to proceed:
1. Log the assumption here with status UNVERIFIED
2. Flag it visibly in the response
3. At start of next session, surface all UNVERIFIED assumptions
4. When user confirms → mark VERIFIED
5. When user corrects → mark CORRECTED, update the assumption

---

## Active Assumptions (Unverified)

> None yet. Will populate during development.

---

## Verified Assumptions

| Date | Assumption | Verified As | Verified By |
|------|------------|-------------|-------------|
| [date] | [what was assumed] | [correct/incorrect + actual value] | user |

---

## Corrected Assumptions

| Date | Original Assumption | Actual Truth | Impact |
|------|---------------------|--------------|--------|
| [date] | [what AI assumed wrong] | [what's actually true] | [did it affect any code?] |

---

## Session Flag Format

At start of each session, if unverified assumptions exist, AI shows:

```
KELAR ASSUMPTION CHECK
──────────────────────
⚠️  [N] unverified assumptions need confirmation:

1. [assumption] — assumed on [date]
   Verify: is this correct? yes / [correct value]

2. [assumption] — assumed on [date]  
   Verify: is this correct? yes / [correct value]

(You can skip these and answer later — type "skip assumptions")
```
