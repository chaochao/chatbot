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
