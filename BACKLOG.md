# BACKLOG — known issues and deferred work

Use for any prompt. Record observed problems and explicit deferrals, not speculative features. `DEVELOP.md` owns the active slice and next action; this file owns work that remains. A logged item is **not fixed** until its acceptance check has been verified.

**Build / checkpoint:** <tag or current build>
**Mode:** <building / frozen — frozen means no code>
**Last reviewed:** <date and time>

## Triage

| Priority | Meaning | Order |
|---|---|---|
| P0 | Crash, data loss, or unauthorized data access | First |
| P1 | Broken core flow, unmet must-have, or a misleading trust claim | Before extra features |
| P2 | User gets stuck, can't recover, or can't understand a label/action | UX before new backend depth once must-haves work |
| P3 | Polish or optional depth | Only after higher priorities |

Statuses: **open**, **in progress**, **blocked** (name the dependency), **deferred** (reason and revisit condition), **verified** (check and evidence recorded). A priority reflects impact; a short estimate doesn't make a polish item urgent. Flag work over 15 minutes before starting. After freeze, record and explain gaps; don't start fixes.

## Items

Copy the row for each issue; remove the placeholder row when filling this file. Use human-readable issue names in demos and slides.

| Issue / area | Priority | Status | User impact and reproduction / evidence | Smallest fix | Estimate / dependency | Acceptance check |
|---|---|---|---|---|---|---|
| Mobile artifact hydration warning | P2 | open | At 390px, initial server/client rendering differs for the existing hidden Artifact; React recovers and the evidence acceptance passes, but Next shows an issue badge. Screenshot: docs/screens/2-evidence-panel-mobile.png. Code: components/chat/artifact.tsx uses viewport width to return an empty div on desktop versus null on mobile. | Make the initial artifact viewport branch agree between server and client. | ~5 minutes; Phase 5 hardening | Reload `/` at 390px with no hydration error, then open evidence, switch vendor, and close successfully. |

## Explicit deferrals

Required work stays labeled as required even when time runs out. Link any agreed scope decision from `DECISIONS.md`; don't silently turn missing requirements into optional enhancements.

| Item | Required or optional | Why deferred / user impact | Revisit when | Decision / related issue |
|---|---|---|---|---|
| <item> | <required / optional> | <reason and consequence> | <condition> | <link or none> |

## Verification record

Move an item to **verified** only after its acceptance check passes. Keep the original issue for history. If testing fails, return it to **open** and add the new evidence.

| Issue | Change / checkpoint | Verified by / when | Evidence |
|---|---|---|---|
| <name> | <commit / tag> | <person or agent; timestamp> | <test result and/or browser steps, screenshot path> |

At each slice gate: run [UX-CHECKLIST.md](UX-CHECKLIST.md), add new findings, update statuses, and put the next chosen item in `DEVELOP.md`. At handoff or freeze: make sure unfinished work is still visible here and the biggest gap appears in [DEMO.md](DEMO.md) and `PRESENTATION.md`.
