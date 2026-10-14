# DEMO — click, say, recover

Fill this after the core flow works. Keep the finished deck and Q&A in [PRESENTATION.md](PRESENTATION.md); use [DEVELOP.md](DEVELOP.md), [DECISIONS.md](DECISIONS.md) and [BACKLOG.md](BACKLOG.md) as evidence. This template works for any prompt. Replace every `<placeholder>` before rehearsal.

## Before presenting

- **User and job:** <person/role> needs to <outcome>.
- **Opening screen / URL:** <route with the intended selection and filters>.
- **Known demo data:** <human-readable names and expected result>.
- **Provider:** <live or disclosed mock; verified from the stream metadata>.
- **Checkpoint:** <last tested presentation tag>.
- **Biggest gap:** <what is missing, impact, smallest next fix>.
- **Fallback:** <saved screenshots or recording paths from the tested build>.

Rehearse from the opening URL on the frozen build. Check data, credentials, server and browser zoom before the talk. Don't reset the database during the presentation. “Freeze” means docs, deck and rehearsal only; log new issues in BACKLOG.

## Live script (about 5–7 minutes)

Write exact labels and spoken sentences, not instructions to yourself such as “explain the value”. Lead with what the user sees and does, then why it matters. Remove rows for features outside the brief; don't imply an unbuilt action works.

| Time | Click / visible result | Say |
|---|---|---|
| 0:00 | Open <main view>; point to <headline> | “<User> needs to <job>. The first thing they see is <insight>, so they know <next action>.” |
| 0:45 | Select <named item>; show <evidence/relationships> | “This is <meaning in plain words>. The evidence comes from <source>; this check establishes <exact limited claim>.” |
| 1:30 | Use <primary action> on that item; show result in place | “They can <action> where they're already looking. The result is <visible change>.” |
| 2:15 | Use Undo, then repeat only if needed | “An accidental click is recoverable here.” |
| 2:45 | Ask <prepared question>; show incremental output and named evidence | “The answer arrives as it is generated. This link opens <source name>; a linked record alone doesn't prove the claim.” |
| 3:30 | Trigger the rehearsed failure/interruption below | “<Exact recovery line from the selected scenario>.” |
| 4:30 | Retry; show a complete answer or the honest fallback | “Retry starts a new attempt. The earlier partial answer remains visible.” |
| 5:15 | Show <saved result / reload / final summary>, if implemented | “The result is <user outcome>. The largest remaining gap is <gap>; I'd address it with <fix>.” |

## One deliberate failure or interruption

Choose **one** predictable scenario and rehearse recovery. Never rely on an accidental outage.

| Scenario | Setup and action | Expected UI | Say / recover |
|---|---|---|---|
| Stop mid-answer (default) | Use a sufficiently long prepared question; click Stop after text appears | Partial text remains, incomplete label, Retry | “The user can stop generation without losing what arrived.” Retry and let it finish. Verify server cancellation before the demo. |
| API unavailable | In a local demo only, stop the API after loading the screen; trigger a request | Inline error with Try again, existing content retained | “The request failed, and the screen tells us how to recover.” Restart the API, verify health, then Try again. |

If recovery doesn't work after one attempt: “The live service isn't recovering. This is the last tested result; I'll show the saved capture and explain the limitation.” Open <fallback path>. Say explicitly that it is a capture. Don't debug live or call a stopped answer complete.

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
