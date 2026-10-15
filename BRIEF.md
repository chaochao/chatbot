# BRIEF

Captured from ../PROMPT.md and ../README.md. The top three answers are confirmed by Chao; remaining defaults are assumptions.

- **Repo (forked):** Local copy of vercel/chatbot; fork ownership not verified. See REPO-NOTES.md.
- **Persona:** CONFIRMED: leader investigating the process.
- **User:** CONFIRMED: leader investigating how vendor onboarding actually happens.
- **Job to be done:** Investigate differences between observed vendor onboarding and the SOP, inspect evidence, and get suggested next actions.
- **Definition of done (at 3 hours):** CONFIRMED: show priority findings immediately; let the leader inspect affected vendor timelines beside the SOP, review suggested investigation actions, and ask focused follow-up questions. Findings and evidence remain usable if AI fails.
- **Data given (shape, size, format):** data/events.json: 419 events across 60 vendor cases; fields: id, caseId, vendor, activity, team, actor, tool, timestamp. data/vendor-onboarding-sop.md: seven-step SOP, ten-business-day target, mandatory security review before legal review.
- **AI feature / model / API key:** CONFIRMED: OpenAI key only → direct `@ai-sdk/openai`, GPT-4.1 mini (D1). Derive event facts in code; use the model to explain them.
- **Stack constraints:** Build in the supplied repo. ASSUMED: retain Next.js, React, AI SDK, Drizzle/Postgres, SWR, and existing UI components.
- **Setup (laptop, GitHub, agent, deploy?):** Laptop; no Docker — local Postgres 16 via brew; fork and run the repo. Share source, decisions, and AI traces. ASSUMED: local demo sufficient; deployment not required.
- **Claude Design allowed (UI and deck)?:** Any AI tools allowed. ASSUMED: Claude Design allowed within the build clock.
- **Prep time between build and presentation?:** Three-hour build, then about twenty minutes presenting plus Q&A. ASSUMED: prepare the deck within the build clock; no extra preparation time.
- **Trust / citation needs (what must be traceable):** CONFIRMED: click a finding to inspect supporting events and the SOP. ASSUMED: every observed claim links to events; policy statements link to the SOP. Missing evidence does not prove an activity never occurred. Observed exceptions are not permission to bypass policy.
- **The one demo path (click by click):** CONFIRMED: open onboarding view → inspect priority findings → click a finding → inspect the first affected vendor's timeline beside the SOP → switch vendors → review suggested next action → ask a focused follow-up.
- **What they care about most:** Make process answers useful and trustworthy. Kit context: scoping, AI collaboration, UI quality, evidence, and interactive exploration.

## Confirmed scope after grilling

- **Decision supported:** Help the leader choose which process issue to investigate first and explain why.
- **Priority:** Possible missing required reviews and steps recorded out of order appear before delays. Say “no recorded review,” never infer that missing evidence proves a skipped step.
- **Entry:** Findings appear before the user types. Chat supports follow-up investigation.
- **Evidence:** Clicking a finding opens the first affected vendor's timeline beside the exact SOP rule. Allow vendor switching; highlight relevant events with dates, teams, and source tools.
- **Suggestions:** Advice only: who to contact, what to verify, and why. Sending messages, creating tickets, and changing the SOP are out of scope.
- **Chat scope:** Findings, affected vendors, SOP comparisons, and suggested investigation steps.
- **AI failure:** Compute comparisons in code. Keep findings, timelines, and SOP text usable; offer retry for AI explanations.
- **Human approval rule:** Do not execute or commit a proposed action before explicit human approval. Viewing evidence or receiving a suggestion is not approval. This rule does not expand the advice-only scope into action execution.
- **Agent workflow:** Require Chao's explicit approval before Git commits; this overrides the kit's automatic checkpoint-commit rule. Product code remains paused until the implementation plan is approved.

Chao confirmed this scope and added the human approval rule. No product code is authorized by the grilling session alone.

## Open questions
Ask the separate reviewer session; this build agent must not read the reviewer-only file.

### Restate
“The user is a leader investigating vendor onboarding. They need differences and suggested next actions, with findings linked to events and the SOP.”

### Confirmed answers
1. **User:** A leader investigating the process.
2. **Pain / AI role:** Highlight differences and suggest next actions.
3. **Success:** Click a finding → inspect supporting events and the SOP.

### Remaining gaps
4. **User:** How often does the leader investigate, and what do they use today? → default: periodic review using the SOP and consultation with Procurement.
5. **Pain:** ANSWERED — prioritize possible missing required reviews and steps recorded out of order; delays second.
6. **Data / edge cases:** Are these complete case histories, and does a missing event mean the step was skipped? → default: completeness unknown; label missing evidence explicitly.
7. **AI role:** ANSWERED — focused follow-ups about findings, affected vendors, SOP comparisons, and investigation actions; inspect sources without editing process records.
8. **Edge cases:** Model failure ANSWERED — deterministic findings and evidence remain usable, with retry for AI explanations. Unknown processes or empty results → default: explain the limitation.
9. **Permissions:** Can every demo user see all supplied events? → default: yes for this fixture only; do not imply production authorization.
10. **Setup:** ANSWERED — OpenAI key works, local Postgres runs. Deployed URL → default: not required, local demo.
11. **Timing:** Does the three-hour limit include deck preparation? → default: yes; protect the final fifteen minutes for freeze and presentation preparation.

## Raw notes

Prompt: Within watches how work actually happens and builds a map of it. Customers ask how to onboard a vendor. Current chatbot answers are text-heavy and sometimes based on an old SOP, so users ask Jin instead. “Make that better.”

Mock instructions: fork the provided repo, build for three hours, present for about twenty minutes plus Q&A. Any AI tools allowed. Deliver source code, decision log, and AI chat traces. Ask questions in a separate reviewer session; keep reviewer-only material out of the build session.
