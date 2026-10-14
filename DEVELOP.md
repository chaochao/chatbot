# DEVELOP: where we are

Single source of truth for progress. Any agent resuming work reads this first.

**Phase:** 1 · Capture the brief
**Build started at:** 16:39 (Wed Oct 14) — Phase 5 at 18:24, freeze at 19:24
**Last checkpoint:** _(tag)_
**Now:** — (main)
**Next:** Capture the interview prompt and notes in BRIEF.md. Blocker: app needs POSTGRES_URL + AUTH_SECRET + AI_GATEWAY_API_KEY (see REPO-NOTES Run).

## Domain
_(entities, fields, relationships, UI vocabulary — filled in Phase 2)_

## Slices
_(filled in Phase 2; tick when merged)_
- [ ] 1. … — acceptance: …

## Out of scope
- … — why: …

## Measurements
| What | Before | After | How measured |
|---|---|---|---|

## Usage
_(Claude Code tokens/cost; run `node usage.mjs "<label>"` at each phase gate and paste the row. Cost is an estimate at list price.)_
| Time | Gate | Msgs | In | Out | Cache write | Cache read | Cost |
|---|---|---|---|---|---|---|---|
| 16:40 | Phase 0 start | 6 | 0.0k | 3.2k | 36.3k | 305.9k | ~$0.60 |
| 16:41 | Phase 0 end | 13 | 0.0k | 6.8k | 46.9k | 751.9k | ~$1.02 |

## Interviewer questions
_(timestamped: anything the interviewer asked or remarked on; each gets an answer in PRESENTATION.md Q&A)_
- 

## Log
_(timestamped: what happened, what broke, what an agent got wrong and how it was fixed, handoffs)_
- 16:39 Clock started. pnpm missing → used `npx pnpm@10`. Install OK. App not run: no local Postgres, no gateway key.
- 16:40 Added `usage.mjs` (token/cost per phase gate, Chao's request).
