# TRACES — how AI was used (for the presentation)

They will read your chat traces. Keep this short log so you can point to the good moments.
Export the full Claude Code sessions at freeze (`/export`, or copy from `~/.claude/projects/<project>/`) into `docs/traces/`.

| Time | What I asked AI | What I decided (not the AI) | Accepted / rejected / corrected — why |
|---|---|---|---|
| 17:10 | Claude Design: 3 layouts (findings home / chat-native / process map) from a prompt filled with real counts | Picked 1a (15 vs 10/10) | Accepted layout + state frames; rejected its invented placeholder data (Vendor 07 dates, "+14 more") — build uses real timelines for all 16 vendors |
| 17:25 | Claude Design slow | Didn't wait: started slice 1 on direction A in parallel | Kept the build clock moving; design used as reference for slice 2 + Phase 5 |
| 17:43 | Codex: resume, propose five-line slice 2 plan, wait for OK | Chao approved the plan and commit after acceptance; kept amber | Accepted: amber marks possible gaps without implying a confirmed violation |
| 17:46 | Build the reference with real evidence | Follow the approved handoff; no generated records or fake vendor counts | Codex moved the activity map into a browser-safe module instead of importing the server's filesystem code into the panel |
| 17:50 | Review the first browser screenshots against a1 | Keep the evidence panel full-height with the composer under findings | Corrected Codex's first layout: composer initially crossed below both columns and took space from evidence |
| 17:52 | Verify the acceptance path and edge cases | Keep source dates in UTC and missing evidence explicit | Four Playwright checks passed: vendor selection/reload/focus/Copy/Undo; duplicate and non-SOP events; mobile/reduced motion; loading/empty/retry. Existing mobile artifact hydration warning logged for hardening |
| 18:00 | Codex hit its limit mid-slice; Claude Code resumed from files + git | Trust git over the agent's log | Corrected: Codex's DEVELOP.md claimed tag v0.2 existed; `git tag` showed it didn't. Re-verified in browser before committing |

## Highlights for the "How I used AI" slide
- Planning: AI critiqued my plan (not wrote it):
- One rejected suggestion and why: design's red deviation accent and illustrative vendor dates were not treated as evidence; use amber and real events.
- One correction (AI was wrong, how I caught it): screenshot comparison caught Codex's composer spanning below the evidence panel; corrected to the findings column.
- Second-pass review caught: preserve duplicate review events rather than flattening them; keep SOP tool labels limited to tools actually named by the SOP.
