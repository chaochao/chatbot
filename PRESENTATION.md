# PRESENTATION

Built up during the build, turned into the deck in Phase 6. Target: ~25 min talk, rest Q&A.

## Slice notes

- **Before (17:17):** `design/reference/2-answer.png`. Asked "How do I onboard a new vendor?" → 10 generic steps, no company SOP, never mentions the mandatory security review, no sources, no person to ask. This is why users ask Jin.
- **Slice 1 — Findings home** (`docs/screens/1-findings-home.png`): findings show before the user types. Decision: compute findings in code from the event log (D3), so the numbers are exact and testable and work with no model. Copy says "No recorded security review", never "skipped".
- **Slice 2 — Evidence panel** (`docs/screens/2-evidence-panel.png`, mobile: `docs/screens/2-evidence-panel-mobile.png`): click a finding, switch affected vendors, compare seven SOP steps with real records, and inspect highlighted evidence. Advice supports Copy and Dismiss/Undo without sending anything. D4: amber means a possible gap, not a confirmed violation. Screenshot review corrected the composer placement; mobile verification exposed an existing artifact hydration warning, logged in BACKLOG.md. Acceptance and four browser tests passed, plus TypeScript, Biome, and three unit tests.
_(appended after each slice: what it does · one decision and why · what broke · screenshot path)_

## Deck
_(written in Phase 6; one block per slide)_

### 1. <title>
- line
- line
Image: docs/screens/…
Notes: what Chao says out loud.

## Q&A
_(written in Phase 6: likely questions with 2–3 sentence answers)_

**Q:** …
**A:** …
