# Onsite build — general rules

Rules that hold for **any** onsite project or prompt. Each came from a real mistake in a mock; the example is only there to remember why.

## 1. UX first (it's what a senior FE role is judged on)
- **Walk the screen as the user for 2 minutes at every checkpoint**, before any new backend work. Ask: can they act where they look? Is every label plain? Is the most important thing the most visible?
- **The most important insight is a headline**, not something the user has to compute from bars or tables. *(mock #1: "Request approval takes 73% of all time")*
- **The primary action sits next to the thing it acts on, above the fold.** Edits go in a quiet menu; destructive actions go last.
- **Separate deciding from editing.** A review decision ("Looks right") and edit actions (rename, merge, delete) never share one button row.
- **A status shown on an item is changeable on that item**, and the result appears in place with **Undo**.
- **Nothing silently disappears.** Resolved, deleted or merged items stay visible as resolved, with Undo.
- **Every accidental click is recoverable where it happened**, and a final sign-off summarizes what is being signed.
- **Rows and cards are `div`/`li` with a stretched title button**, never one big `<button>`, so actions can be added later.
- **Show the reason with the question:** "AI confidence is low (0.62). Is this a real step?", not a bare button.
- **Hide empty tiles** (three "—" boxes say nothing). Show a single clear empty state instead.
- **Every query has loading, empty and error states.** Errors say what to do ("Can't reach the server. Try again") within about a second.

- **Protect the UI craft block** (1:45–2:45). Cut features, never polish. A smaller demo that feels finished beats a bigger rough one.
- **Build on the repo's design system**, not a new look.

## 2. Human-readable everywhere (UI, demo, slides, spoken lines)
- **No internal IDs, codes or field names** (`st_9`, `in_3`, `D5`, `p90`, `stepHint`). Use names and plain words: "Request approval", "slow case (1 in 10)".
- **Numbers are ones a person would say:** "28 invoices", "73% of the time", "1h 58m typical".
- **If the builder can't read a label, the user can't either.** Fix it immediately.

## 3. Trust and AI UX
- **Never overclaim.** Label the exact check ("highest median duration: 1h 58m"), not "✓ Verified". Keep "data check" and "human-reviewed" separate.
- **A suggestion shows its evidence and its alternatives** ("Keep it", "choose another"). Call it a suggestion.
- **Every AI claim links to evidence**, and broken or unknown references are flagged, never dead links.
- **Streaming is a set:** Stop that cancels on the server too, Retry, partial output kept, a timeout, and rate-limit messages.
- **Render model output as plain text**, and give the model a compact, precomputed context, not raw data.
- **A mock is fine if disclosed**, and the switch to the real model is verified, not assumed.

## 4. Data and modeling
- **Profile the data in the first 10 minutes** and list the traps: duplicates, nulls, negative values, aliases, time zones, ordering, things that exist in one file but not the other.
- **Clean once at load, never silently.** Show what was excluded and why.
- **If the input has relationships (edges, parent/child, sequences), the main view shows them.** A flat list can hide the real shape. Ask "what do the relationships imply?" before choosing the layout.
- **Derive order from the data (timestamps) when it matters**; don't trust a given order.
- **User edits are an append-only log** over immutable source data: you get undo, audit (who/when/what) and before/after for free.
- **Identity is decided by the server**, never sent by the browser.

## 5. Process
- **Start the clock and git before reading the prompt.**
- **The stack is fixed** (React + TanStack Query/Router + Tailwind; Hono + Zod + Prisma/SQLite). Zero minutes on framework choice.
- **Core flow first:** skeleton in ~5 minutes, all must-haves in ~1 hour, one slice = branch → PR → CI → merge → tag → screenshot.
- **After the must-haves: UX before backend depth.** Audit logs and identity can wait; an unreadable screen can't.
- **"Freeze" means no code.** After it, only docs, deck and rehearsal.
- **Keep `DEVELOP.md` (now/next/log), `DECISIONS.md` and a `BACKLOG.md` current**, so any agent or person can resume.

## 6. Communication (Chao ↔ agent)
- **Agent:** lead with the exact text or command to use, or the single next action. Take sensible defaults and say so in one line. Ask only when the choice is genuinely Chao's, with a recommendation and a time cost. Flag anything over 15 minutes before starting. Show a screenshot after each UI change.
- **Chao:** state the intent with each question: **fix it**, **UI only**, **just explain**, **log it**.
- **Shared words:** freeze (no code) · UI only (no server/schema) · log it (backlog) · v2 (slides only) · handoff (commit + DEVELOP).
- **Accuracy over polish:** if a summary contradicts the log, the log wins. Never round "3 minutes" up to "the whole demo".

## 7. Demo and deck
- **Build the deck from a template**, with the agent writing paste-ready prompts. Never freehand slides.
- **Demo script = a table of "click" and "say"**, starting with what the user sees and does, then why it matters.
- **Show one failure state on purpose** (API down, Stop mid-answer).
- **Name your biggest gap before they do**, with the fix.

---

## Log of mocks
| Mock | Date | Score | Biggest lesson |
|---|---|---|---|
| #1 Process Review | 2026-10-03 | 80 (Senior) | UX problems were found by the human, not the agent; walk the screen at every checkpoint |
| Round 2 (Arun, real) | 2026-10-12 | passed | Answer the exact question first; own the backend; know the render-registry answer (see WITHIN-CONTEXT.md) |
