# UX CHECKLIST — run at every slice gate, before merging

Senior FE onsites judge UX first. Spend **2 minutes walking the screen as the target user** (not as the builder) before any new backend work. Fix what fails, or log it in `BACKLOG.md` with a priority.

## The 2-minute walk (answer each out loud)
1. **In 10 seconds, what is the one thing the user should notice?** Is it a headline on screen, or do they have to compute it?
2. **Can they act where they look?** The primary action is next to the item it acts on, above the fold, no scrolling.
3. **Can they read every label?** If you, the builder, hesitate on a label, rename it now.
4. **What happens on an accidental click?** The result shows in place, with Undo, right there.
5. **Did anything disappear?** Resolved, deleted, merged or filtered-out items stay visible (as resolved), with Undo.
6. **Is anything claiming more than we checked?** "Verified", "correct", "safe" must match exactly what the code checks.

## Within craft (frontend role: UI quality is graded; run in full in Phase 5)
Arun's words: **delightful, like Apple · trust · citations · interactive diagrams · discoverable, tactile, queryable · compact huge data.** See `WITHIN-CONTEXT.md`.
- [ ] **Feels finished:** every state on the demo path is designed (loading, empty, error, streaming, success). No default spinners alone, no raw JSON.
- [ ] **Motion with purpose:** 150–250 ms ease-out on expand, focus, panel open, node select. Nothing bounces. `prefers-reduced-motion` respected.
- [ ] **No layout jump** while data streams in: fixed panels, reserved space, skeletons shaped like the final content.
- [ ] **Interactive, not a picture:** diagrams support click (open source), hover (preview), expand/collapse, focus/zoom-to-fit.
- [ ] **Every claim and node is traceable:** click → citation panel naming the source event / record. Unknown sources say so.
- [ ] **Graph doesn't overwhelm:** start from one entity or question (1-hop), clusters collapsed, search to focus, fit-to-view, legend. Under ~50 visible nodes at first glance.
- [ ] **Summary first, details on demand:** a headline insight above the diagram; detail in a side panel.
- [ ] **User stays in control:** suggestions can be accepted, dismissed, undone. Copy is calm and never implies the AI replaces the person.
- [ ] **Matches the repo's design system:** its components, tokens, spacing and type. Don't invent a new look.
- [ ] **Visual hierarchy:** one primary action per area; consistent spacing scale; max 2–3 type sizes; one accent color.
- [ ] **First-run hint:** an empty or first view tells the user what to do ("Ask how a process works, or pick one below").

## Layout and hierarchy
- [ ] One primary button per area. Edits live in a quiet menu; destructive actions are last and set apart.
- [ ] **Deciding** (approve, looks right, dismiss) is separate from **editing** (rename, merge, delete).
- [ ] The **reason** comes with the question: "AI confidence is low (0.62). Is this a real step?", not a bare button.
- [ ] A **status shown on an item is changeable on that item.** Same control everywhere the item appears (row, card, panel).
- [ ] Rows and cards are `<li>`/`<div>` + a stretched title `<button>` (`after:absolute after:inset-0`), actions on top (`relative z-10`). **Never a whole row as one `<button>`.**
- [ ] Buttons don't wrap into orphans; long badge text is shortened (details in the panel).
- [ ] Empty data = one clear empty state, not tiles full of "—".
- [ ] Selection and filters live in the URL; selecting doesn't jump the scroll (`resetScroll: false`).

## Words and numbers (UI, demo, slides, spoken)
- [ ] **No internal IDs, codes or field names** (`st_9`, `in_3`, `D5`, `stepHint`, `p90`). Use names and plain words.
- [ ] Numbers a person would say: "28 invoices", "73% of the time", "1h 58m typical", "slow case (1 in 10)".
- [ ] Every number has a unit and a label.

## States (every query and mutation)
- [ ] Loading (skeleton), empty, error with what to do + Try again, within ~1 second (React Query `retry: 1`).
- [ ] Mutations disabled while pending; errors shown next to the control that failed.
- [ ] Locked/read-only state is explained ("Approved. Undo approval to edit").
- [ ] A final sign-off summarizes what is being signed (count of items, edits, open issues).

## Trust (any AI or computed claim)
- [ ] Each claim links to its evidence; broken references are flagged, never dead links.
- [ ] Verdict text names the exact check ("Highest median: 1h 58m"), and separates **data check** from **human reviewed**.
- [ ] Suggestions say "suggested", show why, and offer "Keep it" and "choose another".
- [ ] Data cleaning is visible: "33 events excluded · why?".

## Relationships in the data
- [ ] If the input has edges, parents, sequences or variants, **the main view shows them** (paths panel, arc diagram, grouped blocks). A flat list hides the shape.
- [ ] The most common paths and their share are visible without clicking.

## Accessibility basics
- [ ] Every control reachable by keyboard; visible focus ring; tabs have roles.
- [ ] Text contrast AA; status never by color alone (text + color).
- [ ] `prefers-reduced-motion` respected; icon-only buttons have `aria-label`.
