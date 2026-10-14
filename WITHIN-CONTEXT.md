# WITHIN CONTEXT — what they care about (from Arun, Oct 12 round)

Read before Phase 1. Every product and UI choice should point back to one of these.

## Format (confirmed by Arun)
- On the morning: they send an **open-source repo** "very similar to what we do, functionally and technically". Fork it and run it on the clock (recon ≤ 10 min).
- Morning: a **slightly ambiguous problem statement, by design**. They grade how you scope, how you sketch the solution, and **how you use AI to ideate**.
- 3–3.5 hours to build.
- Then present (slides or talk-through) and **share source code, decision logs and AI chat traces**.
- You also meet the team. Use it: ask questions, check them out.

## Company in one line
Within is the **enterprise AI harness**: a "company brain" / "work brain" that learns how the org works (people, processes, handoffs, relationships, history). ChatGPT, Claude and Codex are *tools*; Within is the organizational memory above them.

## Two personas (pick one out loud in the brief)
| Persona | Who | UI need |
|---|---|---|
| Process performer | Person doing the work; AI observes passively | Companion, buddy. Helpful in the moment. **Never feels like AI is taking their job.** |
| Leader / advisor | Queries the work brain to improve the org | Visualize the company brain; ask questions; get interactive, cited answers |

## Keywords (Arun's words → what to show in the UI)
| Keyword | Show it |
|---|---|
| **Delightful, "like Apple", onboarding** | Crafted transitions, empty/loading states, first-run hint. Never raw JSON. |
| **Trust** | Honest copy, confidence shown, user stays in control (accept / dismiss / undo). |
| **Explainability, citations, "track back where this came from"** | Every claim and node clickable → source panel. "Why am I seeing this?" |
| **Interactive diagrams, "click into them"** | Click, hover, expand, focus. The diagram is a tool, not a picture. |
| **Discoverable, tractable, tactile, queryable** (graph of 100k+ nodes, "they'll be lost") | 1-hop start, search to focus, collapsed clusters, minimap, breadcrumbs. |
| **"See the work happening… edge cases and if conditions"** | Streamed steps, branch labels on edges, highlighted current path. |
| **"Humongous data, how do you compact it"** | Summary first, details on demand. Aggregate, then drill down. |
| **Deterministic vs non-deterministic presentation** | Fixed view catalog + Zod UI spec + fallback (see `AI-UX.md` → Agent output to UI). |

**This is a frontend role. UI quality is the product.** A smaller demo that feels finished beats a bigger one that looks rough.

## Answers to have ready (he asked these in round 2)
- **Who decides the render?** "The model picks a view name and props from a catalog the frontend registered. Zod validates it. A registry maps view to component. The model chooses *what*; the code decides *how*. Invalid spec → table + text."
- **Won't that add seconds?** "No extra call. Most results map by rule from the tool's schema. Otherwise the view is one enum field in the same structured output. Stream the view event first and mount the empty component; data fills in."
- **Deterministic vs generated visuals?** "Deterministic: model returns graph JSON with IDs, never coordinates; ELK/dagre lays it out; React Flow renders; each node keeps its source ID. Generated: a declarative spec (Mermaid / Vega-Lite), validated, sandboxed, with fallback. Good generated views get promoted to the catalog after review."
- **Huge graph?** "Never render the whole graph. Start from a question or entity, 1-hop neighborhood, cluster, collapse, search to focus. Past a few thousand visible nodes, WebGL. The real fix is showing less, not drawing faster."

## Questions to ask the team
1. "How do you show a leader a claim from the graph so they trust it enough to act?"
2. "What has earned trust from process performers so far, and what scared them off?"
3. "How do you split deterministic views and generated ones today?"
4. "For the leader persona, how big is a typical company graph?"
5. "What would make someone in this role a clear success in the first 90 days?"

## Lessons from the Arun round (don't repeat)
- Answer the **exact** question first; repeat his noun back ("the render decision…").
- Never say "since it's a frontend role". You built the backend too. Say so.
- Give the reason, then the example. Don't cite Claude Code as the authority.
- Cut hedges ("maybe you have a better solution, but I'll try my best").
