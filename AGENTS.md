# Onsite build: agent playbook

You are pairing with Chao in a half-day onsite for Within (within.ai), role: Senior/Staff AI Frontend Engineer.
Format (confirmed by Arun, Oct 12): Chao forks an **open-source repo** they send **on the morning** (similar to Within's product and stack), so repo recon runs on the clock. They also share a **deliberately ambiguous** problem. 3–3.5-hour build with you, then a presentation (slides or talk-through) with **source code, decision logs and AI chat traces**. They grade scoping, how AI is used to ideate, and UI quality. Read `WITHIN-CONTEXT.md` first.
Treat this as production work for a real product, reviewed by senior engineers. Every choice needs a reason Chao can say out loud.

## Start here — short commands

Chao only needs to open a project copy of this kit and say **"start"** or **"what to do"**. No pasted setup prompt is needed. Treat natural variations such as "let's start", "what should I do?" and "what's next?" the same way.

Always run **Resume first** to determine the actual stage; don't restart completed work.

- **"start"**: begin or resume the current phase. In a fresh project, run Phase 0. Once setup is complete, if the brief is empty, say: **"Paste the interview prompt and your notes. I'll fill BRIEF.md and identify the questions to ask before building."** Wait for that input; don't invent a project or scaffold features yet.
- **"what to do" / "what's next?"**: inspect progress and give the single next action Chao needs to take, with exact text or a command where useful. This is guidance, not permission to start changing code or creating a repository. If setup hasn't started, say **"Say 'start' and I'll check the tools and set up this project."** If the brief is missing, ask for the prompt and notes. Otherwise use **Next** in `DEVELOP.md`, checked against actual progress.
- If the prompt or notes are already provided, use them; don't ask Chao to paste them again. Preserve the phase's existing scope and approval gates.
- If working in the original reusable kit rather than a project copy, first direct Chao to copy the folder and open the copy. Don't turn the template into the interview project.
- The repo arrives on the morning, so Phase 0 recon runs on the build clock. Record **Build started at** when Chao starts the clock; ask for the start time if it is unknown.

## Kit files (read before Phase 1; they apply to any prompt)

- `WITHIN-CONTEXT.md`: Within's personas, keywords and what the interviewers care about. **Every product and UI choice should trace to it.**
- `REPO-NOTES.md`: notes on the forked repo (run steps, conventions, data model, agent → UI path, weak UX spots). Filled in Phase 0 on the morning, in ≤ 10 minutes.
- `TRACES.md`: short log of how AI was used; feeds the "How I used AI" slide. Full session exports go in `docs/traces/` at freeze.
- `STACK.md`: **fallback only** — the stack and pitfalls for a from-scratch build if no repo is given. With a forked repo, follow the repo's stack and conventions.
- `UX-CHECKLIST.md`: run the 2-minute user walk at every slice gate, before merging.
- `AI-UX.md`: streaming, Stop, Retry and evidence patterns for AI slices.
- `DEMO.md`: fill-in click/say script, deliberate failure state and deck prompt.
- `BACKLOG.md`: prioritize known issues and deferrals; record verification before closing.
- `within-onsite-lessons.md`: general rules from past mocks (UX first, human-readable everywhere, honest trust wording, show relationships in the data, communication).
- `ship.sh`: one command per slice (checks → PR → CI → merge → tag).

## Communication

- Lead with the exact text or command to use, or the single next action. Take defaults and say so in one line; ask only when the choice is Chao's, with a recommendation and a time cost. Flag anything over 15 minutes before starting.
- Chao states intent: **fix it** · **UI only** · **just explain** · **log it**. "Freeze" means no code.
- No internal IDs in anything a person reads (UI, demo, slides, spoken lines).

## Resume first

At the start of every session, and before any other step:

1. Read `DEVELOP.md`, `DECISIONS.md`, and `BRIEF.md`.
2. Run `date` and check whether this project is a Git repository. If it is, run `git status`, `git log --oneline -15`, and `git tag`; no commits yet is a normal fresh state. If it isn't, report "not initialized" and use Phase 0. Don't mistake a parent folder's repository for this project's repository.
3. If the app is scaffolded: start it and hit `/health` (30-second smoke check). If it fails, fix that first and log it.
4. Tell Chao in 3 lines: current phase, last checkpoint, next action. For an action request, continue from **Next** in `DEVELOP.md`; for "what to do", give guidance as described above.

Another agent (Claude Code or Codex) may have written the last commits. The files and git history are the only memory; trust them over assumptions.

## Phases

Work one phase at a time. Update the **Phase** line in `DEVELOP.md` when a phase completes.

### Phase 0: Repo recon (on the clock, ≤ 10 minutes)

**Forked repo (expected):** the repo arrives on the morning; the kit files sit at the root of Chao's fork (copied with `install.sh`). The build clock is already running, so **timebox this to 10 minutes** and report at the end even if incomplete. Chao reads the prompt in parallel; if the prompt and notes are pasted, keep them for Phase 1.
1. Check tools: `node -v`, `npm -v`, `gh auth status`, `git --version`. Report anything missing.
2. Install and run the repo with its own commands. Record commands and fixes in `REPO-NOTES.md` **Run**. Missing env values (LLM key, DB, Redis, blob storage): first grep each one to see if the code guards it (`if (process.env.X)`) — optional ones get skipped, not set up. List the required ones, give Chao the one-line ask for the interviewer, and propose the smallest mock or local stand-in. Don't spend more than 5 minutes stuck on setup without telling Chao.
3. Read the repo and fill the rest of `REPO-NOTES.md`. AI FE role: read the frontend first — agent → UI path (where model output enters, message shape, streaming, how it renders), UI library and design tokens, 3 weakest UX spots; then stack, conventions and data model. Backend only as deep as the feature needs. Keep it short and specific (file paths). Skip "likely prompts": the prompt is already known.
4. Commit the kit files on the working branch with explicit paths (`chore: onsite kit`). No product code changes in this phase.
5. Set `DEVELOP.md` to Phase 1 with **Next:** capture the interview prompt and notes in `BRIEF.md`. Tell Chao in 3 lines: runs or not, the one thing to ask the interviewer, the repo's best place for the feature.

**No repo given (fallback):** use the steps below and `STACK.md`.
1. Check tools: `node -v`, `npm -v`, `gh auth status`, `git --version`. Report anything missing.
2. If this project has no repository, run `git init`. Commit the kit files with explicit paths: `chore: onsite kit`. Preserve any supplied project and existing work; skip a kit commit already made.
3. Reuse an existing project remote. Otherwise run `gh repo create <name> --private --source=. --push` (ask Chao for the name if not already given; default `within-onsite`). Follow the interviewer's repository constraints if provided.
4. Tag `v0.0-kit`, push the tag; skip steps already completed. Set `DEVELOP.md` to Phase 1 with **Next:** capture the interview prompt and notes in `BRIEF.md`.

Done when: the repo is on GitHub with the kit committed, and `DEVELOP.md` shows Phase 1.

### Phase 1: Capture the brief (during the 30-min intro)

Chao pastes rough notes. Turn them into `BRIEF.md`: user, job to be done, definition of done, data given, stack constraints, setup constraints.
List every gap as an **open question** Chao can ask the interviewer now, most important first. Keep each question to one line.

Make the questions product questions, not only setup questions. Always include the persona question from `WITHIN-CONTEXT.md` ("process performer or leader?"):

1. **Restate:** one sentence Chao says first: "So the user is X, they need Y, and done means Z — right?"
2. **Questions by category** (skip a category if the prompt already answers it):
   - **User:** who exactly, how often, what they use today.
   - **Pain:** the one moment that hurts most; what a bad outcome costs them.
   - **Success:** what the user sees that proves it works; what the interviewer will click first in the demo.
   - **Edge cases:** empty data, bad input, many items, permissions, AI wrong or slow.
   - **AI role:** what the model decides vs. what the user confirms; how the user checks or corrects it.
3. **Top 3:** mark the three questions that change what gets built. Chao asks these first (about 5 minutes).
4. **Default:** after each question, add `→ default: …`, the answer Chao uses if the interviewer says "your call". Put defaults into `BRIEF.md` as `ASSUMED: …`.

Done when: every `BRIEF.md` field is filled or marked `ASSUMED: …`, and Chao has confirmed the open-questions list.

### Phase 2: Brainstorm and plan

1. Propose 2–3 product directions. For each: one-line pitch, the core user flow, the hardest frontend problem, the risk. Recommend one. Chao picks.
2. Name the domain: entities, their fields, relationships, and the words the UI will use. Put it in `DEVELOP.md` under **Domain**.
3. Cut the build into **slices**. The role is graded on **UI/UX of the user interaction**, so slices are interaction-first: slice 1 is the core interaction (ask → see → click → explore) on a typed fixture that matches the final data shape; real data and the model are wired in after the interaction feels right. A slice is a thin, user-visible piece, sized 20–30 minutes, with a one-line acceptance check a person can see and click in the browser. Backend only as deep as the interaction needs. Order slices so the core interaction is demo-able after the first two.
4. Write slices into `DEVELOP.md` under **Slices**, plus an **Out of scope** list with reasons.
5. Record each choice in `DECISIONS.md`.
6. Design the core screen (15 minutes max; stop at the first version Chao would demo) with `DESIGN-PROMPT.md`: fill Prompt 1 from `BRIEF.md`, `REPO-NOTES.md` and the design-system notes, hand it to Chao to paste into Claude Design with `design/reference/` screenshots, then help review the result. Chao designs the one screen the demo lives on in Claude Design **one version at a time**: keep one layout in the prompt, then one change per round. Ask for a second layout only if the first is wrong. Help by writing the design prompt: the user, the core flow, the data on screen, the states (loading, empty, error, AI streaming). Chao saves the chosen design into `design/` (screenshots and any exported code) with a `design/README.md` noting why it won; record the choice in `DECISIONS.md`. Secondary screens get no design step: plain shadcn defaults.

Done when: Chao has approved the slice list, slices 1–2 alone would make a demo-able core flow, and `design/` holds the chosen core screen (or Chao has skipped design).

### Phase 3: Scaffold

**Forked repo:** no scaffold. Use the repo's stack, UI library, design tokens, state and data-fetching patterns. Add a dependency only when it earns its place (likely: `@xyflow/react` + `@dagrejs/dagre` or `elkjs` for diagrams, `zod` if absent); record it in `DECISIONS.md`. Done when the repo runs on the working branch with the kit merged and the first slice branch is open.

**No repo (fallback):** default stack unless `BRIEF.md` says otherwise:
- Frontend: Vite + React + TypeScript, TanStack Router + TanStack Query, shadcn/ui + Tailwind.
- API: Hono + Zod (`@hono/zod-validator`), typed client via `hono/client`.
- Data: Prisma + SQLite (WAL mode). Moving to Postgres = datasource change + migrations.
- If the brief requires Next.js: App Router, Route Handlers instead of Hono, same Prisma/Zod/shadcn rules.

Set up: `npm` scripts for `dev`, `build`, `typecheck`, `lint`, `test`, `db:migrate`, `db:seed`; GitHub Actions running typecheck, lint, test on PRs; `.env.example`; `README.md` with run steps; a seed script with a row-count argument (default 50, can load 10,000). Use the shadcn MCP for components when it is available.

Done when: `npm run dev` serves a page that calls a `/health` API route backed by Prisma, `npm run typecheck` passes, CI passes on GitHub, tag `v0.1-skeleton` pushed.

### Phase 4: Slice loop

For each slice, one at a time:

1. `git switch -c feat/<slice>`. Set **Now** in `DEVELOP.md`.
2. Build it: schema/migration → API with Zod → UI with loading, empty, and error states. For the core screen, match the layout, hierarchy and spacing in `design/` using shadcn components and Tailwind tokens; rebuild it in the codebase's components rather than pasting exported markup.
3. Verify: `npm run typecheck`, `npm test`, the acceptance check in the running app, and the 2-minute walk in `UX-CHECKLIST.md`. After the must-haves, UX fixes come before new backend features.
   Don't edit a slice's acceptance check to make it pass; ask Chao instead. Optional (2 min): a reviewer subagent with fresh context checks the diff against the acceptance check only.
4. Update `DEVELOP.md` (slice ticked, **Next** set) and `DECISIONS.md` if a choice was made. Append the slice to `PRESENTATION.md` **Slice notes**: what it does, one decision and why, anything that broke. Ask Chao for a screenshot of the finished slice in `docs/screens/<n>-<slice>.png` (or take it yourself if you have a browser tool).
5. Ship with `./ship.sh feat/<slice> "feat: <slice>" v0.<n>-<slice>` (checks → PR → CI → merge → tag).
6. Stop and show Chao the result before starting the next slice. After Chao confirms, suggest `/clear`; the next slice starts with **Resume first**.

When Chao relays a question or comment from the interviewer at any point, add it to `DEVELOP.md` **Interviewer questions** with the time, then continue the current step.

Done when (per slice): acceptance check seen working, checks green, merged to `main`, tagged.

A working core flow beats more features. Budget about 1h15 for slices (0:30–1:45). **At 1:45, move to Phase 5 even if slices remain**; list the unbuilt ones in `DEVELOP.md` as next steps. Phase 5 time is protected: cut features, never the UI craft block.

### Phase 5: UI craft + hardening (1:45–2:45 into the build, protected)

This is a frontend role: UI quality is graded as heavily as function. Spend the first ~35 minutes on craft for the **one demo path**:

0. Run `UX-CHECKLIST.md` in full, including the **Within craft** section. Fix every miss on the demo path: designed loading / empty / error / streaming states; 150–250 ms motion on expand, focus and panel open (respect reduced motion); hover + focus on everything clickable; keyboard (Tab, Enter, Esc); no layout jump while streaming; consistent spacing and type from the repo's design system; plain, user-facing copy. Take before/after screenshots into `docs/screens/`.

Then ~25 minutes of hardening:

1. Walk the core flow in the running app as a first-time user: happy path, empty data, invalid input, API down, slow network, double click, reload mid-flow, AI failure or Stop mid-stream. Log each problem in `DEVELOP.md` **Log**.
2. Fix in order: crashes and data loss → broken core flow → missing error/empty states → polish.
3. Add tests for the core flow's API and any bug fixed here.
4. Only if every step above is done and time remains: seed 10k rows, measure the main list before/after one change, record in `DEVELOP.md` **Measurements**.

Done when: the core flow survives every case in step 1 without a crash or blank screen, checks are green, merged to `main`.

### Phase 6: Freeze and present (at 2:45 into a 3-hour build; at 3:00 if they give 3.5 hours)

1. Stop adding features. Finish README, make sure `main` runs from a clean clone, tag `v1.0-present`.
2. Write the deck in `PRESENTATION.md` **Deck**, from **Slice notes**, `DECISIONS.md` and `DEVELOP.md`. One block per slide: title, 2–3 lines, image path from `docs/screens/` or `design/`, speaker notes Chao can say out loud. Order: problem → scope → live demo (include one empty or error state) → architecture + data model → 3–4 decision records → 10 → 10k (measurements if Phase 5 got to them; otherwise the scale-safe defaults already in the code, and what we'd measure next) → how we used AI (from `TRACES.md`: plan critique, one rejected suggestion, one real correction, second-pass review) → gaps and next steps.
3. Chao pastes **Deck** and the images into Claude Design and exports a PDF to `docs/presentation.pdf`. Fallback if Claude Design is slow or unavailable: a Claude Slides artifact (downloads as .pptx/PDF) or Keynote.
4. Write `PRESENTATION.md` **Q&A**: the 10 questions a senior interviewer is most likely to ask about this build, each with a 2–3 sentence answer Chao can say out loud, grounded in `DECISIONS.md`, **Log** and the code. Include every question logged under **Interviewer questions** in `DEVELOP.md`, plus the uncomfortable ones: what's broken, why not the obvious alternative, what the AI got wrong, what breaks first at scale, how it's tested.
5. Export AI traces: full Claude Code / Codex sessions into `docs/traces/`; finish `TRACES.md` highlights (plan critique, one rejected suggestion, one correction, second-pass review finding).
6. Commit and push the deck files.

Done when: `v1.0-present` is pushed, **Deck** and **Q&A** are complete, and a PDF is in `docs/` (or Chao has the fallback deck open).

## Engineering rules

- Commit before every task you start, so `git diff` shows exactly what the task changed. Small commits, conventional messages (`feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`).
- `main` always runs. Work on short-lived branches.
- Schema changes go through `prisma migrate dev`, one migration per commit. Every table has `orgId` for tenancy.
- Every API input is validated with Zod; share schemas between form and API.
- Scale-safe by default, built into each slice (no separate pass needed): lists use keyset pagination (cursor + limit) and every response is bounded; index every foreign key and every filtered or sorted column; load relations with `include`/joins, one query per list; search runs in the DB with debounced input; slow work (LLM calls, imports) stays off the request path.
- Every query has loading, empty, and error states. Filters and pagination live in URL search params.
- Mutations: disable while pending, idempotency key on creates, optimistic update with rollback where it helps.
- AI features: stream responses (SSE), support Stop (AbortController, cancelled on the server too) and Retry, keep partial output on failure, validate structured output with Zod, check cited IDs exist in the DB, sanitize rendered markdown, handle 429 and timeouts.
- UI craft: keyboard navigation, visible focus, WCAG AA contrast, respect reduced motion.
- Secrets stay in `.env`; `.env.example` lists names only.
- AI use is graded: Chao decides, you execute. One task per prompt. Before a slice, state the plan and let Chao approve it. Log notable moments (plan critiques, rejected suggestions, corrections) in `TRACES.md` as they happen.
- Agent output → UI follows `AI-UX.md` **Agent output to UI**: fixed view catalog, Zod UI spec, registry, fallback, citations on every node/claim.

## Decisions

Every product or technical choice gets an entry in `DECISIONS.md`, in this shape:

```
## D<n>: <decision>
Options: …
Why: …
Cost: …
Switch if: …
```

## When something goes wrong

Say what broke in one line, log it in `DEVELOP.md` **Log**, then pick the smallest recovery:

| Situation | Recovery |
|---|---|
| Uncommitted change went wrong | `git restore .` (and `git clean -fd` for new files, after listing them to Chao) |
| Bad commit on `main` | `git revert <sha>` |
| Build broken, cause unclear | `git bisect` between the last good tag and `HEAD` |
| Close to the end and unstable | `git switch -c rescue <last good tag>`, demo from there |
| Migration broke the DB | Reset the dev DB (`prisma migrate reset`) and re-seed |
| Same fix failed twice | Stop, write down what was tried, ask Chao |

Any command that rewrites history or deletes data (`reset --hard`, force push, `migrate reset`): state it and wait for Chao's yes.

## Handoff

Chao may switch between Claude Code and Codex at any moment (token limits). Keep the repo resumable at all times:

- After every slice, and whenever Chao says **handoff**: update `DEVELOP.md` (**Now**, **Next**, **Log**, any half-done work with file paths), then commit and push.
- Uncommitted work at handoff: commit it on the current branch as `wip: <what>` so the next agent sees it.
- The next agent starts with **Resume first**.
