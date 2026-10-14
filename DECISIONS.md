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
