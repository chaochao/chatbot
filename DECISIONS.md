# DECISIONS

One entry per product or technical choice. Newest last.

## D1: Build on the forked repo's stack and conventions
Why: they chose a repo like their own; following its patterns in 3 hours reads as senior. Zero minutes on framework choice.
Switch if: no repo is given → STACK.md fallback (React + TanStack + Tailwind; Hono + Zod; Prisma + SQLite).

## D1a (fallback only): API framework: Hono
Options: Express, Fastify, NestJS, Hono, Next.js Route Handlers
Why: Typed RPC client gives end-to-end types with no codegen; Zod validation middleware; SSE streaming built in; minimal setup.
Cost: Smaller ecosystem than Express/Fastify.
Switch if: The team already runs Fastify, or the brief requires Next.js (use Route Handlers).

## D1: Call OpenAI directly instead of Vercel AI Gateway
Options: AI Gateway key (repo default) · direct OpenAI via `@ai-sdk/openai` · mock models only.
Why: the only key available is an OpenAI key. Swap is 3 files (`lib/ai/providers.ts`, `lib/ai/models.ts`, title call in `app/(chat)/actions.ts`); model ids keep the `openai/` prefix so the gateway's public capability lookup still works.
Cost: model picker shows only GPT-4.1 / GPT-4.1 mini; `@ai-sdk/openai` pinned to 4.0.8 to match `ai@7.0.15`'s provider types.
Switch if: a gateway key appears — revert `providers.ts` to `gateway.languageModel`.

## D2: Direction A — findings home + evidence panel (Claude Design skipped for now)
Options: A findings home + panel · B chat-native cards · C process map.
Why: brief requires findings before typing and usable when AI fails → core flow must not depend on the model. Data has clear, countable deviations (8/60, 8/60, 12/60). Claude Design was slow; waiting costs build time.
Cost: less "wow" than a process map; chat-native reuse comes later (slice 3).
Switch if: interviewer asks to "see the flow" → add a 7-step SOP strip with deviation counts above the findings (no graph lib).
Update 17:35: Claude Design returned 3 clickable layouts; 1a scored 15 vs 10 / 10 (`design/README.md`). Confirms D2.

## D3: Findings computed in code from the fixture, not by the model and not in Postgres
Options: model reads events and finds issues · SQL over imported events · pure TS over `data/events.json`.
Why: deterministic, testable, fast; the model only explains and answers follow-ups with these facts as tool output. 419 events fit in memory.
Cost: no live data; re-read per request.
Switch if: events > ~10k or live ingestion → Postgres table, indexes on (caseId, timestamp), keyset pagination.

## D4: Amber evidence, real records, advice only
Options: red violation styling · amber possible-gap styling; illustrative design data · supplied event records.
Why: Chao approved amber for slice 2. Missing events do not prove a review was missed, and review events do not confirm approval. Every affected vendor is selectable; duplicate records remain visible. Dates use UTC to avoid shifting events across days. The SOP column names only tools stated in the SOP; observed tools appear separately.
Cost: more careful wording and a horizontally scrolling vendor list. Copy and Dismiss/Undo operate locally; suggestions send nothing.
Switch if: verified approvals or human-reviewed findings justify a stronger status.

## D5: Evidence beside findings, with selection in the URL
Options: modal · inline expansion · reference's right evidence panel.
Why: follow a1 with a 520px desktop panel, independently scrolling evidence table and visible advice card. The composer stays under findings. Narrow screens show the evidence panel in place of the list; close returns focus to the selected finding. URL selection survives reload without storing process data in a new database.
Cost: a small workspace component coordinates selection; the shared activity map moves out of the server-only module. Generic starter prompts are hidden on this process home so they do not crowd evidence or imply grounded follow-up support before slice 3.
Switch if: a future multi-process workspace needs persistent investigation state beyond URL selection.
