# STACK — fixed, no discussion

Decided before the onsite. Don't spend interview minutes on framework choice; say "my default stack, chosen for typed end-to-end and fast iteration" if asked. Switch only if the brief **requires** something else (e.g. Next.js → Route Handlers instead of Hono, everything else the same).

| Layer | Choice | Why (one line to say) |
|---|---|---|
| UI | Vite + React + TypeScript | Fast dev server, no SSR needed for an internal tool |
| Data fetching | TanStack Query | Cache, loading/error states, retries, invalidation |
| Routing | TanStack Router (code-based) | Typed search params: selection and filters in the URL |
| Styling | Tailwind v4 (`@theme` tokens) | Design tokens once, consistent spacing/colors |
| API | Hono + Zod (`@hono/zod-validator`) + `hono/client` | End-to-end types, no codegen, SSE built in |
| DB | Prisma 6 + SQLite (WAL) | Real schema + migrations; Postgres = datasource change |
| AI | OpenAI or Anthropic via `fetch` + SSE, mock streamer behind the same interface | Works without a key; real model when the key arrives |
| Tests | Vitest | Pure domain logic + one API integration test |
| CI | GitHub Actions: typecheck, lint, test | Every PR green before merge |

## Layout
```
src/       React client (pages, components, queries.ts, api.ts)
server/    Hono app (app.ts), index.ts, auth.ts (currentUser), ask.ts (SSE)
shared/    Zod schemas + pure domain logic, used by both, all unit-tested
prisma/    schema.prisma, migrations, seed.ts
data/      given input files
```

## Scaffold (≈5 minutes; worked in mock #1)
```sh
npm create vite@latest vt -- --template react-ts --no-interactive   # in a scratch dir, then copy src, index.html, tsconfig*, vite.config.ts, package.json, .oxlintrc.json in
npm pkg set name=<project>
npm i hono @hono/node-server @hono/zod-validator zod @prisma/client@6 @tanstack/react-query @tanstack/react-router tailwindcss @tailwindcss/vite clsx tailwind-merge lucide-react
npm i -D prisma@6 tsx vitest concurrently
```
`package.json` scripts:
```json
{
  "dev": "concurrently -k -n api,web \"tsx watch --env-file-if-exists=.env server/index.ts\" \"vite\"",
  "build": "tsc -b && vite build",
  "typecheck": "tsc -b",
  "lint": "oxlint",
  "test": "vitest run",
  "db:migrate": "prisma migrate dev",
  "db:seed": "tsx prisma/seed.ts",
  "setup": "npm install && prisma migrate deploy && npm run db:seed",
  "postinstall": "prisma generate"
}
```
`vite.config.ts`: `plugins: [react(), tailwindcss()]`, `server: { proxy: { '/api': 'http://localhost:8787' } }`.
Add `tsconfig.server.json` (include `server`, `shared`, `prisma`; `types: ["node"]`) and reference it from `tsconfig.json`; add `"node"` to `tsconfig.app.json` `types` because the client imports the server's `AppType`.
`server/index.ts`: `await db.$queryRawUnsafe('PRAGMA journal_mode=WAL')`, then `serve({ fetch: app.fetch, port: 8787 })`.
`src/main.tsx`: `new QueryClient({ defaultOptions: { queries: { retry: 1, retryDelay: 500 } } })`.
`.gitignore`: `node_modules/ dist/ .env .env.* !.env.example *.db *.db-journal *.db-wal *.db-shm .DS_Store .claude/settings.local.json`.
`.env.example`: `DATABASE_URL="file:./dev.db"`, `OPENAI_API_KEY=`, `DEMO_USER="<name>"`.

Done when: `/api/health` (Prisma-backed) shows on the page, typecheck passes, CI green, tag `v0.1-skeleton`.

## Pitfalls already paid for (don't pay twice)
| Symptom | Cause | Fix |
|---|---|---|
| `TS5101: Option 'baseUrl' is deprecated` | TypeScript 6 | Don't add `baseUrl`/`paths` aliases; use relative imports |
| Real AI key set but the app still uses the mock | `tsx` doesn't read `.env` | `tsx watch --env-file-if-exists=.env` (in the dev script above); verify `provider` in the first SSE event |
| `/api/...` returns `index.html` | Vite restarted after a config change and lost the proxy | Restart `npm run dev` |
| API crashed with `ERR_MODULE_NOT_FOUND` and didn't come back | File imported before it existed; `tsx watch` only watches imported files | Create the file, then `touch server/index.ts` |
| `prisma migrate dev` → "database is locked" | The dev server holds the SQLite file | Stop the dev server, migrate, restart |
| `prisma migrate reset` refuses to run | Prisma blocks AI agents from destructive resets without human consent | Tests use their own DB file: delete `prisma/test.db*`, then `prisma migrate deploy` + seed |
| Error page shows only after ~8s | React Query default 3 retries with backoff | `retry: 1, retryDelay: 500` |
| Clicking a row jumps to the top | TanStack Router resets scroll on navigate | `navigate({ search, resetScroll: false })` |
| Primary button renders blank | Two background classes in one string (`bg-white` beats `bg-accent`) | Separate `btn` and `primary` class constants |
| Page crash "destroy is not a function" | `useEffect(() => el?.scrollIntoView())` returns a value | Block body: `useEffect(() => { … }, [])` |
| Hono client error branch typed `never` | Narrowing after `res.ok` | Check `res.status` values one by one |
| Panel state leaks to the next item | Same component instance reused | `key={selectedId}` on the panel |

## Ship loop (one command per slice)
Copy `ship.sh` from the kit into the repo, then:
```sh
./ship.sh feat/<slice> "feat: <what>" v0.<n>-<slice>
```
It runs typecheck + tests, commits, pushes, opens the PR, waits for CI, merges and tags. Never commit with `git add -A` when another agent may have written files: list the paths.
