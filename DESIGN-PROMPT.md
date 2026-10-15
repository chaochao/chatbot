# DESIGN PROMPT — Claude Design for the core screen (15 min max)

Use in Phase 2, step 6. Design **one screen**: the one the demo lives on. Everything else uses the repo's default components.
First confirm in the morning: "Is it OK if I use Claude Design for the first UI pass?" (`BRIEF.md`).

## On the morning (5 min, once the fork runs)
1. Take 3–4 screenshots of the forked app's main screens → `design/reference/` (app shell, a list, a detail panel, a chat/answer view if any).
2. Fill **Design system** below from the repo: UI library, colors/tokens file path, font, radius, spacing scale, icon set, light/dark.
3. Before the day: run one Claude Design session in the rehearsal (`mock-onsite-3`) so you know the upload + export flow.

## Design system (from REPO-NOTES.md)
- UI library / components: shadcn/ui + Vercel AI Elements (`components/ui`, `components/ai-elements`); chat shell with left sidebar and right artifact panel
- Tokens file: `app/globals.css` (oklch CSS variables)
- Font(s): Geist, Geist Mono
- Primary / accent color: near-black primary `oklch(0.12 0 0)` on `oklch(0.985 0 0)`; neutral grays; no brand accent → pick ONE accent for "deviation" (amber/red)
- Radius, spacing scale: `--radius` 0.625rem; Tailwind 4px scale
- Icons: lucide
- Light / dark: both (next-themes)

## Prompt 1 — three variations (paste, fill `<…>`, attach `design/reference/*` and any data sample)

```text
Design one desktop screen (1440×900) for an enterprise web app. Match the attached
screenshots exactly: same components, colors, type, spacing, radius and icons. Do not
invent a new visual style.

Product: Within, a "company brain" that learns how an organization actually works
(people, processes, handoffs, history) and answers questions about it.
User: <process performer doing their job | team lead / leader improving a process>.
Their job on this screen: <one sentence, e.g. "see how invoice approval really runs and
trust where each step came from">.
Demo path (click by click): <1. … 2. … 3. …>.

Data on screen (use these real names and numbers, no lorem ipsum, no internal IDs):
<paste 5–15 realistic items: process steps, people, counts, durations, shares>

Must include:
- A one-line headline insight above everything else (summary first, details on demand).
- An interactive <flow diagram | graph | card list | table> with clickable items;
  edges show conditions and share of cases ("if > $10k · 27%").
- A side panel for the selected item: what it is, stats in plain words, and citations
  (the source events/records it came from).
- An AI answer area: question field, streamed answer, evidence chips under each claim.
- States as small frames beside the main one: loading (skeleton shaped like the final
  content), empty (with a first-run hint), error (what to do + Try again), AI streaming.

Feel: calm, precise, trustworthy, delightful (Apple-level polish). The user stays in
control: suggestions can be accepted, dismissed or undone. Never imply AI replaces them.
One primary action per area. Max 3 type sizes. One accent color. Accessible contrast.

Give me 3 variations with different layouts:
A. Diagram-first: the diagram fills the canvas; answer and details in a right panel.
B. Answer-first: chat/answer on the left; the diagram and citations render inside the answer.
C. Split: list/outline on the left, diagram center, detail + citations right.
Label each variation with its trade-off in one line.
```

## Prompt 1 — FILLED for this build (paste this)

```text
Design one desktop screen (1440×900) for an enterprise web app. Match the attached
screenshots exactly: same components, colors, type, spacing, radius and icons
(shadcn/ui, Geist, lucide, neutral grays, 10px radius, left chat-history sidebar).
Do not invent a new visual style. Add only ONE accent color, used for deviations.

Product: Within, a "company brain" that learns how an organization actually works
(people, processes, handoffs, history) and answers questions about it.
User: a leader investigating how vendor onboarding really runs vs the written SOP.
Their job on this screen: decide which process issue to investigate first, see the
evidence, and know who to ask next.
Demo path: 1. Open the onboarding view: ranked findings show before typing.
2. Click "No recorded security review". 3. The first affected vendor's timeline opens
beside the exact SOP rule. 4. Switch to another affected vendor. 5. Read the suggested
next step (who to contact, what to verify, why). 6. Ask a follow-up in chat.

Data on screen (real, no lorem ipsum):
Header: "Vendor onboarding · 60 vendors · Jul–Sep 2026 · SOP v3 (last edited Nov 2, 2025)"
Findings, ranked:
 1. No recorded security review — 8 of 60 vendors (Vendor 07, 19, 33, 48, 52, 60 …).
    SOP step 4: "Security review (Security, in Vanta). Required for every vendor. No exceptions."
 2. Contract review before security approval — 8 vendors (Vendor 06, 12, 18, 24, 30, 36 …).
    SOP step 5: "Contract review (Legal, in Ironclad). Starts only after security approves."
 3. "Request more info" step not in the SOP — 12 vendors, all by Procurement.
 4. Slowest case: Vendor 11, 14.5 days (target 10 business days; median 6.5 days).
Timeline, Vendor 06 (date · step · team · person · tool):
 Jul 10 Submit vendor request · Requester · Jira
 Jul 10 Procurement review · Procurement · Jin Park · Jira
 Jul 11 Security questionnaire sent · Security · Ben Ito · Email
 Jul 12 Contract review · Legal · Rachel Green · Ironclad   ← out of order (highlight)
 Jul 16 Security review · Security · Ana Silva · Vanta       ← 4 days after contract review
 Jul 16 Create vendor in ERP · Finance · Omar Haddad · NetSuite
 Jul 16 Notify requester · Procurement · Jin Park · Slack
Timeline, Vendor 07: Submit → Procurement review → Contract review (Jul 12) → Create vendor
 in ERP → Notify requester. Security questionnaire and security review: "No recorded event".
Suggested next step (advice only): "Ask Ana Silva (Security) whether Vendor 06 was
reviewed before Legal started. Verify in Vanta. Why: SOP step 5 requires security approval first."
Honest wording: "No recorded review" — never "skipped". Missing evidence ≠ step skipped.

Must include:
- A one-line headline above everything: "16 of 60 vendors have a possible control gap in security review."
- Ranked finding cards: severity, count "8 of 60", one-line SOP rule, clickable.
- Evidence view: vendor timeline beside the SOP steps, deviating events highlighted,
  missing steps shown as dashed "No recorded event" rows; vendor switcher (chips or list).
- Every claim links to its source events (tool + date) or SOP step.
- Suggested next step card with "Copy" and "Dismiss"; nothing is sent automatically.
- Chat input for follow-ups; one streamed answer with evidence chips under claims.
- Small state frames beside the main one: loading (skeleton shaped like finding cards),
  empty ("No differences found vs SOP v3"), AI error (findings still visible + "Try again"),
  AI streaming.

Feel: calm, precise, trustworthy (Apple-level polish). The user stays in control.
One primary action per area. Max 3 type sizes. Accessible contrast.

Give me 3 variations with different layouts:
A. Findings home + evidence panel: findings list fills the main area; clicking opens a right
   panel with vendor timeline beside the SOP; chat input docked at the bottom.
B. Chat-native: findings arrive as a rich card inside the first assistant message; the
   timeline + SOP open as cards inside the conversation; every answer reuses these cards.
C. Process map: the SOP's 7 steps as a horizontal flow; red edges show observed deviations
   ("Contract before security · 8 vendors"); click an edge → vendor timeline panel.
Label each variation with its trade-off in one line.
```

## Prompt 2 — refine the winner (pick one, then)

```text
Go with variation <A/B/C>. Changes:
- <the one thing a first-time user would miss → make it more visible>
- <reduce: remove anything that doesn't serve the demo path>
- Show the selected-node state and the hover preview.
- Show the graph at 3× the items: start from one entity, clusters collapsed, search to focus.
Keep the reference screenshots' visual system exactly.
```

## Pick the winner (2 min, say it out loud)
Score each 1–3. Highest total wins; tie → the one easier to build in 75 minutes.
| Criterion | A | B | C |
|---|---|---|---|
| Headline insight visible in 10 seconds | | | |
| Every claim/node traceable in one click | | | |
| Doesn't overwhelm at 3× data | | | |
| Fits the repo's design system | | | |
| Buildable in the slice budget | | | |

## Save and hand off
1. Export/screenshot the winner and the two losers → `design/variants/`.
2. `design/README.md`: chosen variation, the score table, one line on why it won, one line on what you'd take from the losers.
3. `DECISIONS.md`: `D<n>: Core screen layout = <A/B/C>` with options, why, cost, switch-if.
4. `TRACES.md`: one line — "Claude Design: 3 variations, picked <X> because <…>; changed <…> in refinement."
5. Build it **with the repo's components and tokens**. Use the design as the reference for layout, hierarchy and spacing. Don't paste exported markup.

## On the slide
"I used Claude Design for three layout options in fifteen minutes, picked <X> because <reason>, then rebuilt it in your component library. Here are the two I rejected and why."
