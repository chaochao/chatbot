@AGENTS.md
@WITHIN-CONTEXT.md

Claude Code specifics:
- Use plan mode for Phase 2, and for any slice that touches more than 3 files.
- When available, use the `grilling` skill to pressure-test the Phase 2 plan, and `code-review` on each slice's diff before merging.
- When context gets long, update `DEVELOP.md` and commit before compacting.
