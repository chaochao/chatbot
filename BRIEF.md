# BRIEF

Captured from ../PROMPT.md and ../README.md. Defaults await Chao/reviewer confirmation.

- **Repo (forked):** Local copy of vercel/chatbot; fork ownership not verified. See REPO-NOTES.md.
- **Persona:** ASSUMED: process performer seeking guidance, rather than a leader auditing operations.
- **User:** ASSUMED: employee onboarding a vendor who currently asks Jin in Procurement when the chatbot is unclear.
- **Job to be done:** Understand how vendor onboarding actually works and check the evidence without relying on a wall of text or an outdated SOP.
- **Definition of done (at 3 hours):** ASSUMED: ask the onboarding question, explore a concise process view, inspect supporting events, and distinguish observed behavior from documented requirements.
- **Data given (shape, size, format):** data/events.json: 419 events across 60 vendor cases; fields: id, caseId, vendor, activity, team, actor, tool, timestamp. data/vendor-onboarding-sop.md: seven-step SOP, ten-business-day target, mandatory security review before legal review.
- **AI feature / model / API key:** ASSUMED: keep the existing AI Gateway integration; credentials/model availability require confirmation. Derive event facts in code; use the model to explain them.
- **Stack constraints:** Build in the supplied repo. ASSUMED: retain Next.js, React, AI SDK, Drizzle/Postgres, SWR, and existing UI components.
- **Setup (laptop, GitHub, agent, deploy?):** Laptop, Docker running per mock instructions; fork and run the repo. Share source, decisions, and AI traces. ASSUMED: local demo sufficient; deployment not required.
- **Claude Design allowed (UI and deck)?:** Any AI tools allowed. ASSUMED: Claude Design allowed within the build clock.
- **Prep time between build and presentation?:** Three-hour build, then about twenty minutes presenting plus Q&A. ASSUMED: prepare the deck within the build clock; no extra preparation time.
- **Trust / citation needs (what must be traceable):** ASSUMED: every observed path or claim links to underlying events; policy statements link to the SOP. Missing evidence does not prove an activity never occurred. Observed exceptions are not permission to bypass policy.
- **The one demo path (click by click):** ASSUMED, pending direction approval: ask “How do we onboard a new vendor here?” → inspect process summary → select a step or difference → inspect source events and the related SOP requirement.
- **What they care about most:** Make process answers useful and trustworthy. Kit context: scoping, AI collaboration, UI quality, evidence, and interactive exploration.

## Open questions
Ask the separate reviewer session; this build agent must not read the reviewer-only file.

### Restate
“So the user is an employee onboarding a vendor, they need trustworthy guidance grounded in actual work, and done means they can explore the process and check its sources — right?”

### Top three — ask first (about five minutes)
1. **User:** Is the primary user a process performer onboarding a vendor, or a leader investigating the process? → default: process performer.
2. **Pain / AI role:** When events conflict with the SOP, should we guide the next action or highlight differences for investigation? → default: show observed differences alongside policy; never recommend skipping required controls.
3. **Success:** What should the user be able to see and click in the demo to trust the answer? → default: a concise process view with clickable evidence and clear policy differences.

### Remaining gaps
4. **User:** Is this for occasional requesters or daily Procurement users, and what do they consult besides Jin? → default: occasional requesters using the SOP and chat.
5. **Pain:** What is the most costly failure: delay, wrong handoff, or missed controls? → default: unclear handoffs and uncertainty; expose policy differences without claiming compliance conclusions.
6. **Data / edge cases:** Are these complete case histories, and does a missing event mean the step was skipped? → default: completeness unknown; label missing evidence explicitly.
7. **AI role:** Must answers support arbitrary questions, and how should users correct an answer? → default: prioritize the onboarding question; allow follow-up questions and source inspection, without editing process records.
8. **Edge cases:** What should happen for unknown processes, empty results, or model failure? → default: explain the limitation, preserve available evidence, and offer retry for model failure.
9. **Permissions:** Can every demo user see all supplied events? → default: yes for this fixture only; do not imply production authorization.
10. **Setup:** Are model credentials and Postgres provided, and is a deployed URL required? → default: local Postgres and local demo; use a clearly labeled fixture until model credentials are available.
11. **Timing:** Does the three-hour limit include deck preparation? → default: yes; protect the final fifteen minutes for freeze and presentation preparation.

## Raw notes

Prompt: Within watches how work actually happens and builds a map of it. Customers ask how to onboard a vendor. Current chatbot answers are text-heavy and sometimes based on an old SOP, so users ask Jin instead. “Make that better.”

Mock instructions: fork the provided repo, build for three hours, present for about twenty minutes plus Q&A. Any AI tools allowed. Deliver source code, decision log, and AI chat traces. Ask questions in a separate reviewer session; keep reviewer-only material out of the build session.
