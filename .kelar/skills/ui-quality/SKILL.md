---
name: ui-quality
description: >
  Enforces production-grade UI/UX output with explicit design system rules.
  ALWAYS activate when any UI, component, page, screen, form, layout, or visual
  element is being created or modified. Critical for ensuring consistency and
  quality regardless of model capability.
  Triggers on: "UI", "component", "page", "screen", "layout", "design", "style",
  "button", "form", "card", "navbar", "sidebar", "dashboard", "modal", "table",
  "list", "header", "footer", "responsive", "mobile", "dark mode", "theme"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
---

# UI Quality Enforcement

Bad UI is not a style choice. It is a bug. Treat it as one.

## ⛔ STOP — READ THIS BEFORE WRITING ANY UI CODE

You are about to write UI code. This skill has MANDATORY steps.
Skipping any step is a violation of code quality rules.
"Good enough" does not exist here. Production-grade or nothing.

---

## PHASE 1: DESIGN SYSTEM SCAN

Before writing a single line, find the existing design system.

### Step 1.1 — Locate tokens
```bash
grep -r "css-variables\|:root\|--color\|--font\|--spacing\|--radius\|--shadow" src/ --include="*.css" --include="*.scss" --include="*.ts" --include="*.tsx" -l
```

### Step 1.2 — Extract what exists
```
KELAR UI SCAN
─────────────
Colors found   : [list all --color-* vars or hex values in use]
Fonts found    : [list all font families in use]
Spacing found  : [list spacing scale: 4px, 8px, 16px... or Tailwind: p-2, p-4...]
Radius found   : [border-radius values in use]
Shadows found  : [box-shadow values in use]
Components     : [list existing UI components available to reuse]
CSS framework  : [Tailwind / CSS Modules / styled-components / plain CSS / other]
```

**If NO design system exists → you must CREATE one in Phase 2 before touching any component.**

### Step 1.3 — Reference components
Find 2-3 existing components most similar to what you're building:
- Button? → find existing Button.tsx
- Card? → find existing Card.tsx
- Form? → find existing form patterns

**NEVER create from scratch what already exists.**

---

## PHASE 2: DESIGN DECISION (if no design system exists)

If the project has no design system, establish one NOW — in one place, used everywhere.

### Mandatory design decisions:

```
KELAR DESIGN SYSTEM
───────────────────
Primary color   : [one color — e.g. #1a1a2e or oklch(0.6 0.2 260)]
Secondary color : [accent — e.g. #e94560]
Background      : [base bg — e.g. #0f0f0f or #fafafa]
Surface color   : [card/panel bg]
Border color    : [e.g. rgba(255,255,255,0.08)]
Text primary    : [main text]
Text secondary  : [muted text]
Text disabled   : [disabled state]

Font display    : [heading font — NOT Inter, NOT Roboto, NOT Arial]
Font body       : [body font]
Font mono       : [code font if needed]

Spacing base    : [4px or 8px system]
Radius sm       : [e.g. 4px]
Radius md       : [e.g. 8px]
Radius lg       : [e.g. 16px]
Radius full     : [9999px for pills]

Shadow sm       : [subtle]
Shadow md       : [card elevation]
Shadow lg       : [modal/dropdown elevation]

Transition      : [e.g. 150ms ease or 200ms cubic-bezier(0.4,0,0.2,1)]
```

Write this as CSS `:root {}` variables or Tailwind config before any component.

---

## PHASE 3: COMPONENT BLUEPRINT

Before writing JSX/HTML, define the component contract:

```
KELAR COMPONENT BLUEPRINT
──────────────────────────
Name       : [ComponentName]
Purpose    : [one sentence — what user action does this enable?]
Props/API  : [list all props with types and defaults]
States     : [default | hover | active | focus | disabled | loading | error | empty]
Breakpoints: [mobile | tablet | desktop behavior]
A11y       : [aria-label, role, keyboard nav needed?]
Reuses     : [existing components used internally]
```

**Every state must be designed. "I'll add that later" = shipping a bug.**

---

## PHASE 4: QUALITY GATES — MANDATORY CHECKLIST

Complete this before marking any UI task done.

### 4.1 — Visual Consistency
- [ ] Only uses colors from design system (zero new hex values introduced)
- [ ] Only uses spacing from spacing scale (no arbitrary px values)
- [ ] Font sizes follow type scale (not random px values)
- [ ] Border radius matches design system
- [ ] Shadows match design system
- [ ] Icon library is consistent (only one icon library used, not mixed)

### 4.2 — State Coverage
- [ ] Default state ✓
- [ ] Hover state with visual feedback ✓
- [ ] Focus state with visible outline (accessibility) ✓
- [ ] Active/pressed state ✓
- [ ] Disabled state with reduced opacity and no pointer events ✓
- [ ] Loading state (skeleton or spinner as appropriate) ✓
- [ ] Error state with error color and message ✓
- [ ] Empty state with meaningful placeholder ✓

### 4.3 — Responsive Behavior
- [ ] Mobile (< 640px): tested mentally or in code ✓
- [ ] Tablet (640-1024px): layout adapts correctly ✓
- [ ] Desktop (> 1024px): full layout ✓
- [ ] No horizontal overflow on mobile ✓
- [ ] Touch targets minimum 44x44px on mobile ✓

### 4.4 — Accessibility (non-negotiable)
- [ ] Semantic HTML (button is <button>, not <div onClick>) ✓
- [ ] All images have alt text ✓
- [ ] Form inputs have associated <label> ✓
- [ ] Color contrast ratio minimum 4.5:1 for text ✓
- [ ] Keyboard navigable (Tab, Enter, Escape work) ✓
- [ ] No information conveyed by color alone ✓

### 4.5 — Code Quality
- [ ] No inline styles (unless dynamic values) ✓
- [ ] No hardcoded colors (use variables/tokens) ✓
- [ ] Classnames follow existing naming convention ✓
- [ ] No duplicate CSS ✓
- [ ] Animations use `prefers-reduced-motion` media query ✓

---

## PHASE 5: ANTI-PATTERNS — NEVER DO THESE

These are automatic failures. No exceptions.

### ❌ FORBIDDEN COLORS
```css
/* NEVER hardcode colors like this */
color: #333;
background: white;
border: 1px solid gray;
/* ALWAYS use design tokens */
color: var(--text-primary);
background: var(--bg-surface);
border: 1px solid var(--border-default);
```

### ❌ FORBIDDEN LAYOUTS
```css
/* NEVER use arbitrary magic numbers */
margin-top: 37px;
width: 423px;
padding: 13px 27px;
/* ALWAYS use spacing scale */
margin-top: var(--space-4);  /* or: mt-8 in Tailwind */
width: 100%;
padding: var(--space-2) var(--space-6);
```

### ❌ FORBIDDEN TYPOGRAPHY
- Never use Arial, Helvetica, or system-ui as the primary display font
- Never mix more than 2 font families
- Never use font-size below 12px
- Never use line-height below 1.2 for body text

### ❌ FORBIDDEN INTERACTIONS
- Never a clickable element with no visual feedback on hover/active
- Never a form that can be submitted with no loading indicator
- Never an error with no visible message
- Never a `div` with onClick instead of a `button`

### ❌ FORBIDDEN RESPONSIVE
- Never `width: 500px` on a container without `max-width: 100%`
- Never fixed heights that clip content on small screens
- Never overflow: hidden without testing what gets cut

---

## PHASE 6: DEVIATION PROTOCOL

If the existing design system is inconsistent or ugly:

```
KELAR UI DEVIATION REQUEST
──────────────────────────
Issue found  : [what's wrong with existing system]
Recommendation: [specific change]
Impact       : [N files affected]
Approach     : [A) fix globally B) local override]

Approve change? (yes/no)
```

**NEVER silently introduce new design tokens. Always ask.**

---

## MODEL CAPABILITY NOTE

If you are running on a smaller/weaker model:
- Prioritize Phase 4 checklist over creative design choices
- Prefer simple, proven patterns over complex custom animations
- Always complete ALL 8 states before adding any visual flourish
- When in doubt: boring and correct > flashy and broken
