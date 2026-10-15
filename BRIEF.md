# BRIEF

Captured from ../PROMPT.md and ../README.md. The top three answers are confirmed by Chao; remaining defaults are assumptions.

- **Repo (forked):** Local copy of vercel/chatbot; fork ownership not verified. See REPO-NOTES.md.
- **Persona:** CONFIRMED: leader investigating the process.
- **User:** CONFIRMED: leader investigating how vendor onboarding actually happens.
- **Job to be done:** Investigate differences between observed vendor onboarding and the SOP, inspect evidence, and get suggested next actions.
- **Definition of done (at 3 hours):** CONFIRMED core outcome: highlight process differences, suggest next actions, and let the leader click a finding to inspect supporting events and the SOP. Presentation format remains to be chosen.
- **Data given (shape, size, format):** data/events.json: 419 events across 60 vendor cases; fields: id, caseId, vendor, activity, team, actor, tool, timestamp. data/vendor-onboarding-sop.md: seven-step SOP, ten-business-day target, mandatory security review before legal review.
- **AI feature / model / API key:** CONFIRMED: OpenAI key only → direct `@ai-sdk/openai`, GPT-4.1 mini (D1). Derive event facts in code; use the model to explain them.
- **Stack constraints:** Build in the supplied repo. ASSUMED: retain Next.js, React, AI SDK, Drizzle/Postgres, SWR, and existing UI components.
- **Setup (laptop, GitHub, agent, deploy?):** Laptop; no Docker — local Postgres 16 via brew; fork and run the repo. Share source, decisions, and AI traces. ASSUMED: local demo sufficient; deployment not required.
- **Claude Design allowed (UI and deck)?:** Any AI tools allowed. ASSUMED: Claude Design allowed within the build clock.
- **Prep time between build and presentation?:** Three-hour build, then about twenty minutes presenting plus Q&A. ASSUMED: prepare the deck within the build clock; no extra preparation time.
- **Trust / citation needs (what must be traceable):** CONFIRMED: click a finding to inspect supporting events and the SOP. ASSUMED: every observed claim links to events; policy statements link to the SOP. Missing evidence does not prove an activity never occurred. Observed exceptions are not permission to bypass policy.
- **The one demo path (click by click):** CONFIRMED: inspect a finding → click it → inspect supporting events and the SOP. Include suggested next actions. ASSUMED entry: ask how actual onboarding differs from the SOP.
- **What they care about most:** Make process answers useful and trustworthy. Kit context: scoping, AI collaboration, UI quality, evidence, and interactive exploration.

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
5. **Pain:** What is the most costly failure: delay, wrong handoff, or missed controls? → default: unclear handoffs and uncertainty; expose policy differences without claiming compliance conclusions.
6. **Data / edge cases:** Are these complete case histories, and does a missing event mean the step was skipped? → default: completeness unknown; label missing evidence explicitly.
7. **AI role:** Must answers support arbitrary questions, and how should users correct an answer? → default: prioritize the onboarding question; allow follow-up questions and source inspection, without editing process records.
8. **Edge cases:** What should happen for unknown processes, empty results, or model failure? → default: explain the limitation, preserve available evidence, and offer retry for model failure.
9. **Permissions:** Can every demo user see all supplied events? → default: yes for this fixture only; do not imply production authorization.
10. **Setup:** ANSWERED — OpenAI key works, local Postgres runs. Deployed URL → default: not required, local demo.
11. **Timing:** Does the three-hour limit include deck preparation? → default: yes; protect the final fifteen minutes for freeze and presentation preparation.

## Raw notes

Prompt: Within watches how work actually happens and builds a map of it. Customers ask how to onboard a vendor. Current chatbot answers are text-heavy and sometimes based on an old SOP, so users ask Jin instead. “Make that better.”

Mock instructions: fork the provided repo, build for three hours, present for about twenty minutes plus Q&A. Any AI tools allowed. Deliver source code, decision log, and AI chat traces. Ask questions in a separate reviewer session; keep reviewer-only material out of the build session.
