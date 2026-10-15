# DEMO — click, say, recover

## Timing and checks (retro, mock 3)

- **Start early.** Write this file and the deck prompt when the core flow works (after slice 2). At the freeze, only edit lines that changed.
- **Two notes, both short.** The deck prompt asks for 3 to 5 sentences of speaker notes per slide, in plain words, with no placeholders or "DRAFT" lines. Also keep a one-page read-only reference (this file's script table, the data to point at, the failure line, the fallback) for when the deck is in full screen.
- **Pre-demo deck check (about 5 minutes, full screen, slide by slide):** no empty image slots (a real screenshot or remove the slot); no bracketed or DRAFT text in slides or notes; no raw IDs; no cut-off text; every claim matches the app. Log what you fixed.

Fill this after the core flow works. Keep the finished deck and Q&A in [PRESENTATION.md](PRESENTATION.md); use [DEVELOP.md](DEVELOP.md), [DECISIONS.md](DECISIONS.md) and [BACKLOG.md](BACKLOG.md) as evidence. This template works for any prompt. Replace every `<placeholder>` before rehearsal.

## Before presenting

- **User and job:** A leader investigating vendor onboarding needs to see where practice differs from the written SOP, and decide which issue to look at first.
- **Opening screen / URL:** `http://localhost:3000/` (no selection). Browser zoom 100%, window wide enough for the 520px panel.
- **Known demo data:** 60 vendors. Finding 1: No recorded security review, 8 vendors, first is Vendor 07 (dashed "No recorded event" at step 4). Finding 2: Contract review before security approval, 8 vendors. Finding 3: "Request more info" is not in the SOP, 12 vendors. Finding 4: Over the 10-business-day target, Vendor 11, with an 11-day wait before Contract review.
- **Provider:** Live GPT-4.1 mini via the OpenAI key. The three starter questions return cards from code (counts and timelines come from the event log, not the model).
- **Checkpoint:** `main` at the last pushed commit; message limit is off for the demo (D8).
- **Biggest gap:** A free-text question the two tools cannot answer (for example "Who is the slowest approver?") shows only a card, no explanation. Stay on the starter questions. Smallest fix: let the model add a sentence when no card matches. Mobile layout was skipped.
- **Fallback:** `docs/screens/6-01` to `6-08` (home, panel, Vendor 11 gap, chat timeline, source opens evidence, sticky bar). Say it is a capture.

Rehearse from the opening URL. Check the dev server (`/ping`), the OpenAI key and browser zoom before the talk. Restart the dev server after any config change and send one test message. Don't reset the database during the presentation. "Freeze" means docs, deck and rehearsal only; log new issues in BACKLOG.

## Live script (about 5–7 minutes)

| Time | Click / visible result | Say |
|---|---|---|
| 0:00 | Open `/`. Point to the headline "16 of 60 vendors have a possible gap in security review." | "A leader wants to know where onboarding differs from the SOP. The first thing they see is the answer: 16 of 60 vendors have a possible gap. They don't have to ask first." |
| 0:45 | Click "No recorded security review". Panel opens on Vendor 07; point to the dashed "No recorded event" at step 4 and the quoted rule. | "Left is what the SOP says, right is what the records show. Step 4 has no recorded event. I say 'no recorded', not 'skipped': missing records don't prove the review didn't happen." |
| 1:30 | Click the Vendor 19 chip, then back. Point to the dates and tools on an event. | "Every affected vendor is one click away, with the real events: who, which team, which tool, which date. Nothing is invented." |
| 2:15 | Point to the next-step card. Click Copy (toast), then Dismiss, then Undo. | "The suggested next step is advice only; nothing is sent. Copy it, dismiss it, and an accidental dismiss is one click to undo. The leader stays in control." |
| 2:45 | Click the open finding again (panel closes). Click "Over the 10-business-day target", then Vendor 11. Point to "Waited 11 days before Contract review". | "This one is about time. Instead of one big number, the panel shows where the wait was: 11 days between Security review and Contract review." |
| 3:30 | Click outside to close. Click the starter question "What happened with Vendor 11?". | "Follow-up questions use the same data. The model picks which tool to call; the counts and timelines come from the event log, not from the model." |
| 4:15 | In the chat answer, click the "Vanta · Jul 19" source chip. The evidence panel opens. | "Each source chip is traceable: it opens the same evidence panel, so the answer and the evidence stay connected." |
| 5:00 | Scroll down the chat. Point to the findings bar that fades in at the top. | "The findings stay one click away while the conversation grows." |
| 5:30 | Run the deliberate failure below. | See below. |
| 6:15 | Back to the findings. | "Largest gap: free-text questions the tools can't answer show only a card. I'd let the model add one sentence there. I skipped mobile." |

## One deliberate failure or interruption

| Scenario | Setup and action | Expected UI | Say / recover |
|---|---|---|---|
| Unknown vendor (default) | Type "Tell me about Vendor 99" and send | A red inline line: No vendor named "Vendor 99" in the event log. Chat and findings stay usable | "If the data doesn't have it, the answer says so. It doesn't guess." Then click a starter question to continue. |
| Findings fail to load (optional, local only) | Block `/api/process` in DevTools, reload | "Could not load the onboarding records. Your chat still works." with Try again | "The chat still works, and the screen tells you how to recover." Unblock, click Try again. |

If recovery doesn't work after one attempt: "The live service isn't recovering. This is the last tested result; I'll show the saved capture and explain the limitation." Open `docs/screens/6-01-home.png`. Say explicitly that it is a capture. Don't debug live.

## No IDs, no inflated claims

- UI, slides, screenshots and spoken lines use names and plain words. Internal IDs may exist in code or URLs, never as visible labels.
- Say “Request approval”, not a database key; “our streaming decision”, not a decision-record number; “slow case, one in ten”, not a raw metric abbreviation.
- Every number has a unit, a label and a source. Show measured results only if recorded; otherwise say what you would measure next.
- “Linked evidence”, “data check” and “human reviewed” mean different things. Name exactly what was checked; avoid blanket “Verified”.
- Name the largest known gap and its user impact before Q&A. Don't relabel a missing requirement as a deliberate scope cut unless that cut was agreed.

## Paste-ready deck prompt

Fill the placeholders, then paste this into the chosen deck tool with the actual images. Use the selected visual template; do not freehand a new deck. No deck-tool access is needed to prepare the prompt.

```text
Create a 16:9 presentation using <chosen template>. Audience: senior engineers
and a product lead. Speaker: <name>. Product: <name>. Target: about 25 minutes
including a 5–7 minute live demo, with the remaining presentation time for Q&A.
Tone: calm, precise, product-minded. One idea per slide; 2–3 short lines.
Keep speaker notes as notes. Use the attached images exactly where indicated.
Use names and plain words everywhere, including callouts and notes; no internal
IDs, field names or decision codes. Do not invent features, metrics, test results,
screenshots or claims of verification. Label mock output and unmeasured plans.

Source material:
<paste completed PRESENTATION slice notes, decisions, measurements, relevant log,
known gaps, and the click/say script; remove internal identifiers from slide copy>

Build these slides:
1. Problem — <user>, <job>, <why it matters>.
2. Scope — <delivered must-haves>, <agreed cuts>, <missing requirements>.
3. Live demo — the user journey in three short phrases; notes hold click/say script.
4. Core experience — <main-screen image path>; <visible outcome>.
5. Trust and recovery — <evidence/failure-state image path>; exact checks and limits.
6. Architecture and data — <actual layers and relationships>; one readable diagram.
7. Decisions — <3–4 decisions by descriptive name>, reason and cost for each.
8. From 10 to 10,000 records — <measured result and method, or implemented defaults
   plus the next measurement>; distinguish evidence from expectations.
9. How we used AI — <design/build assistance>, <human gates>, <one real correction>.
10. Gaps and next steps — <biggest gap and impact>, <smallest next fix>, <next priority>.

For every slide output: title, 2–3 short lines, actual image path or “no image”,
and speaker notes I can say out loud. Preserve uncertainty from the source notes.
```

Verify the exported deck: no placeholders, clipped text, raw IDs, stale screenshots or unsupported claims. Save to `docs/presentation.pdf` when available. If the tool is unavailable, present from the completed `PRESENTATION.md` and saved images. Prepare its Q&A with the interviewer questions and honest answers about gaps, alternatives, scale, tests and what AI got wrong.
