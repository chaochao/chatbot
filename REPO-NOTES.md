# REPO NOTES — the forked repo (fill on the morning, Phase 0, ≤ 10 min)

Repo: github.com/vercel/chatbot (v3.1.0) · Fork: github.com/chaochao/chatbot · Runs locally: yes (2026-10-14 ~17:00, guest chat streams from GPT-4.1 mini)

## Run
- Install / dev / test / build: `npx -y pnpm@10 install` (pnpm not global) · `pnpm dev` (Next turbo) · `pnpm check` (ultracite/biome) · `pnpm test` (Playwright, uses mock models when `PLAYWRIGHT=True`) · `pnpm db:migrate`
- Env vars needed: `POSTGRES_URL` (required — `lib/db/queries.ts:36`, every chat/auth path), `AUTH_SECRET` (required, `openssl rand -base64 32`), `AI_GATEWAY_API_KEY` (required for real model; `lib/ai/providers.ts` uses `gateway`).
- Optional (guarded, skip): `REDIS_URL` (`lib/ratelimit.ts:12`, resumable streams `route.ts:407`), `BLOB_READ_WRITE_TOKEN` (file upload only).
- Setup problems: no local Postgres / Docker → `brew install postgresql@16 && brew services start postgresql@16 && createdb chatbot`, `POSTGRES_URL=postgres://<user>@localhost:5432/chatbot`, then `set -a; . ./.env; set +a; npx tsx lib/db/migrate.ts`.
- Only an OpenAI key → direct `@ai-sdk/openai` (D1). `.env` placeholders (`****`) for REDIS/BLOB must be commented out: any non-empty `REDIS_URL` is treated as real.
- Smoke check (no /health route): `GET /` → 200; guest cookie from `/api/auth/guest`, then `POST /api/chat` streams deltas.

## Stack and conventions
- Next.js App Router (`app/(chat)`, `app/(auth)`), AI SDK v5-style `useChat` + `createUIMessageStream`, NextAuth (guest login), Drizzle + Postgres.
- UI: shadcn/ui (`components/ui`), AI Elements (`components/ai-elements`: conversation, message, tool, reasoning, shimmer), Tailwind tokens in `app/globals.css`.
- Lint/format: ultracite (biome) + husky pre-commit. Tests: Playwright e2e (`tests/`).
- Folders: `lib/ai/tools/*` = one file per tool; `components/chat/*` = app components.

## Data model
- `User` 1—n `Chat` 1—n `Message_v2` (parts JSON) · `Vote` (chat, message) · `Document` (artifact, versioned by createdAt) 1—n `Suggestion` · `Stream` (resumable).
- Mock data (no DB): `data/events.json` (~93 KB event log: id, caseId, vendor, activity, team, actor, tool, timestamp) and `data/vendor-onboarding-sop.md` (7-step SOP, "security review required, no exceptions", 10-day target). Looks like a process-mining prompt: actual vs documented process.

## Agent → UI path
- Model output enters at `app/(chat)/api/chat/route.ts` (`streamText` → `createUIMessageStream`, SSE).
- Message = `UIMessage` with typed `parts` (`text`, `reasoning`, `tool-<name>`, custom `data-*` in `lib/types.ts` `CustomUIDataTypes`).
- Rendered in `components/chat/message.tsx` by `part.type` switch (`tool-getWeather` → `<Weather>`, `tool-createDocument` → artifact preview). This switch IS the view registry: new tool → new typed part → new component.

## Weakest UX spots
1. Tool results with no custom view render as generic JSON-ish tool cards (`ai-elements/tool.tsx`) — no evidence or citations.
2. No source/citation concept anywhere: text answers can't be traced back.
3. Generic suggestions (`lib/constants.ts`: Next.js, Dijkstra, weather) — no domain first-run.
