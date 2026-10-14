# DESIGN PROMPT — Claude Design for the core screen (15 min max)

Use in Phase 2, step 6. Design **one screen**: the one the demo lives on. Everything else uses the repo's default components.
First confirm in the morning: "Is it OK if I use Claude Design for the first UI pass?" (`BRIEF.md`).

## On the morning (5 min, once the fork runs)
1. Take 3–4 screenshots of the forked app's main screens → `design/reference/` (app shell, a list, a detail panel, a chat/answer view if any).
2. Fill **Design system** below from the repo: UI library, colors/tokens file path, font, radius, spacing scale, icon set, light/dark.
3. Before the day: run one Claude Design session in the rehearsal (`mock-onsite-3`) so you know the upload + export flow.

## Design system (from REPO-NOTES.md)
- UI library / components: 
- Tokens file: 
- Font(s): 
- Primary / accent color: 
- Radius, spacing scale: 
- Icons: 
- Light / dark: 

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
