# DEVELOP: where we are

Single source of truth for progress. Any agent resuming work reads this first.

**Phase:** 4 · Slice loop (forked repo: no scaffold)
**Build started at:** 16:39 (Wed Oct 14) — Phase 5 at 18:24, freeze at 19:24
**Last checkpoint:** v0.1-findings-home
**Now:** handoff to Codex for slice 2 (feat/evidence-panel)
**Next:** slice 2 evidence panel on branch `feat/evidence-panel` (already created from main @ v0.1-findings-home). Handoff spec below.

### Handoff → Codex: slice 2 spec (17:40)
Reference: `design/reference/a1.png` (layout to match) and `design/reference/states.png` (loading / empty / error frames). Rebuild with repo components (shadcn + Tailwind tokens), don't paste design markup.
- **Data:** already served by `GET /api/process` → `ProcessReport` (`lib/process/findings.ts`): `findings[]` (caseIds, `evidence[caseId]` = event ids to highlight, `sopStep`, `nextStep`), `cases[caseId]` = sorted events, `sop[]`. Map activity → SOP step with `ACTIVITY_TO_STEP`. Real timelines exist for EVERY affected vendor — no placeholders, no "+14 more" fake.
- **Layout:** `components/chat/messages.tsx` empty state renders `<FindingsHome />` (`components/chat/findings-home.tsx`, already has `selectedKind` / `onSelect` props). Add selection state; when a finding is selected, split: findings list left, evidence panel right (~520px, slide in 200ms, respects reduced motion). Esc and × close it and return focus to the card.
- **Panel:** "Evidence · finding N" + title; vendor chips for all affected vendors (horizontal scroll, first selected, keyboard reachable) with a short reason per chip ("No recorded review" / "Contract before security"); two-column table, one row per SOP step 1–7: left = step name, team · tool, rule quote for the cited step; right = observed event(s) for that step (actor, team, tool · date). Highlight evidence event ids (accent). Missing step → dashed "No recorded event" row. Events with no SOP step ("Request more info") → extra row under step 2 labelled "Not in SOP". Duplicate events (VND-006 contract review ×2) show as "recorded twice".
- **Next-step card:** from `finding.nextStep` (contact, verify, why) + source chips (tool · date, SOP step). Buttons: Copy (copies text, toast via `components/chat/toast.tsx`), Dismiss (hides card, Undo). Label "Advice only · nothing is sent".
- **Copy rules:** "No recorded event", never "skipped". Vendor names ("Vendor 07"), not case ids. Date format "Jul 12".
- **Accent:** design uses red for deviations; slice 1 used amber. Pick one and use it everywhere (recommend keeping amber = "possible issue", red reads as "confirmed violation").
- **Acceptance:** open `/` → click "No recorded security review" → panel shows Vendor 07 with dashed "No recorded event" for step 4 → click Vendor 19 chip → its timeline loads → Esc closes the panel.
- **Checks:** `npx tsc --noEmit`, `npx biome check <changed files>` (repo forbids inline arrow props — use useCallback / small components), `pnpm test:unit`. Commit on the branch, merge to main with `--no-ff`, tag `v0.2-evidence-panel`. Don't use `ship.sh` (see Log 17:30). Don't push without Chao.

## Domain
- **Event** (from `data/events.json`): id, caseId, vendor, activity, team, actor, tool, timestamp. UI word: "event".
- **Vendor case**: one vendor's events sorted by time. UI word: "vendor" (never "VND-004" alone; show "Vendor 04").
- **SOP step** (from `data/vendor-onboarding-sop.md`): number, name, team, tool, rule text. UI word: "SOP step 4".
- **Finding**: kind (`missing_security_review` | `contract_before_security` | `undocumented_step` | `slow_case`), severity, title, affected vendors, SOP step cited, evidence event ids. Computed in code, never by the model.
- **Next step** (advice only): who to contact, what to verify, why (cites SOP step). Template per finding kind.
- Relationships: Finding → n Vendor cases → n Events; Finding → 1 SOP step.

## Slices
_(direction A: findings home + evidence panel. Interaction-first, fixture data from `data/`, no new DB tables.)_
- [x] 1. Findings home — `lib/process/findings.ts` (pure, + test) computes ranked findings; empty chat home shows headline + finding cards instead of "What can I help with?". — acceptance: open `/`, see "No recorded security review · 8 of 60 vendors" as the first card, before typing.
- [ ] 2. Evidence panel + next step — click a card → right panel: affected vendor chips, timeline beside the exact SOP rule, deviating event highlighted, dashed "No recorded event" rows, next-step card (Copy / Dismiss, "advice only"). — acceptance: click finding 1 → Vendor 07 shows dashed "No recorded event" for Security review; click Vendor 19 chip → its timeline loads; Esc closes.
- [ ] 3. Grounded follow-up chat — model gets findings + SOP as tool output (`getFindings`, `getVendorTimeline`); tool parts render with the same card / timeline components (view registry in `message.tsx`); vendor chips in answers open the panel. — acceptance: ask "Which vendors had contract review before security?" → answer lists vendors as clickable chips that open the evidence panel.
- [ ] 4. (if time) AI failure path — findings stay usable when the model errors; answer shows "Try again". — acceptance: wrong API key → findings and panel still work, chat shows retry.

## Out of scope
- Process map / graph (direction C) — why: new dependency + layout work; findings answer "what to investigate first" faster.
- Executing actions (send message, create ticket, edit SOP) — why: brief says advice only; human approval rule.
- Storing events in Postgres — why: 419 events fit in memory; fixture is read-only. Switch at 10k+ events (keyset pagination + indexes).
- Editing process records, multi-process support — why: one process given.

## Measurements
| What | Before | After | How measured |
|---|---|---|---|

## Usage
_(Claude Code tokens/cost; run `node usage.mjs "<label>"` at each phase gate and paste the row. Cost is an estimate at list price.)_
| Time | Gate | Msgs | In | Out | Cache write | Cache read | Cost |
|---|---|---|---|---|---|---|---|
| 16:40 | Phase 0 start | 6 | 0.0k | 3.2k | 36.3k | 305.9k | ~$0.60 |
| 16:41 | Phase 0 end | 13 | 0.0k | 6.8k | 46.9k | 751.9k | ~$1.02 |
| 16:55 | App running | 38 | 0.1k | 17.9k | 68.2k | 2824.5k | ~$2.54 |
| 17:30 | Slice 1 done | 80 | 0.2k | 54.2k | 250.2k | 7746.2k | ~$7.73 |

## Interviewer questions
_(timestamped: anything the interviewer asked or remarked on; each gets an answer in PRESENTATION.md Q&A)_
- 

## Log
_(timestamped: what happened, what broke, what an agent got wrong and how it was fixed, handoffs)_
- 16:39 Clock started. pnpm missing → used `npx pnpm@10`. Install OK. App not run: no local Postgres, no gateway key.
- ~16:50 Only an OpenAI key → switched provider (D1). Pinned `@ai-sdk/openai@4.0.8` after a provider-type clash with `ai@7.0.15`.
- ~17:00 Local Postgres via brew, migrations OK, chat streams end to end.
- 17:40 Chao: switch development to Codex. Claude Code wrote slice 2 handoff spec. `usage.mjs` tracks Claude Code only; Codex usage via its `/status`.
- 17:30 Slice 1 done: findings home, 3 unit tests (`pnpm test:unit`, node:test via tsx — no new dep). ship.sh not used: repo has no npm typecheck/lint/test scripts and Playwright CI needs secrets → merge locally + tag; push when Chao says.
- 17:27 Chao approved slices 1–2 and allowed commits during development.
- 17:25 Claude Design slow → don't block; build direction A, use Claude Design output (if any) as Phase 5 polish reference. Behind schedule: slices start ~17:30 vs 17:09 plan; slice 4 is the first cut.
- 17:10 Data check: 8/60 no recorded security review, 8/60 contract before security, 12 "Request more info" (not in SOP), median 6.5 d, max 14.5 d (VND-011). Quirks: duplicate events (VND-006 contract review ×2), actor alias "J. Park" vs "Jin Park", null actor on requester events.
- 17:10 Filled DESIGN-PROMPT.md Prompt 1 with A/B/C (findings home / chat-native / process map) for Claude Design.
- 16:40 Added `usage.mjs` (token/cost per phase gate, Chao's request).
