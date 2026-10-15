# RETRO: mock onsite 3 (2026-10-14)

Points from Chao. Apply to the kit files (`AGENTS.md`, `DESIGN-PROMPT.md`, `DEMO.md`) after the list is complete.

1. **Design: one option at a time.** Asking Claude Design for 3 variations took longer than planned (build three, then score three). Ask for one screen from the reference screenshots, then one change per round. Cap at 15 minutes. Only ask for a second variation if the first is wrong.
2. **Demo and deck prep: start before the code is done.** Demo and deck prep took a lot of time after the code freeze. Generate the deck prompt and the click script when the core flow works (after slice 2, about 60% through the build), and refresh only the changed lines at the freeze. Run it in parallel with the polish work, not after it.
3. **A demo note to read, separate from the deck.** When the deck is in full screen, the speaker notes are hidden. Keep a one-page reference (the click and say script, the data to point at, the failure line, the fallback) in a printable or second-screen file, such as `DEMO.md` as a short cheat sheet. Generate it at the same time as the deck prompt (point 2).
4. **Deck prompt: ask for short speaker notes per slide.** The notes came out long (some over 150 words, one cut off on screen). In the deck prompt, require 3 to 5 sentences of speaker notes per slide, plain words, no placeholders or "DRAFT" lines. Check the length on the slide before exporting.
5. **Pre-demo deck check.** The exported deck had empty image placeholders and leftover notes ("DRAFT", a bracketed placeholder on slide 3). Before presenting, run a fixed check on every slide: no empty image slots (each has a real screenshot or the slot is removed), no bracketed or DRAFT text in slides or notes, no raw IDs, no text cut off, and every claim matches the app. Do it in full-screen mode, slide by slide, about 5 minutes, and log what you fixed.

## Claude Code's points (added after Chao's list)

6. **Restart after config changes.** A raised message limit did not take effect until the dev server restarted, and Chao hit the limit again in the demo window. After any config or server-side constant change, kill and restart the dev server, then send one test message before saying it is fixed. (Saved to memory.)
7. **No guards for the demo.** A template message limit (10 per hour) blocked a walk-through. At the start of Phase 0, check template rate limits and entitlements and switch them off for the demo; log a real limit as a next step in `BACKLOG.md`.
8. **Check every scale or trust claim against the code before it goes in a deck prompt.** The deck prompt said "bounded responses"; the API returns the whole report. Verify each claim with one grep before writing it.
9. **Walk the finished app in a real browser early, and again at the freeze.** Walking the app found a repeated quote in the SOP panel, model text repeating a card, and a scroll jump on close. Run the walk at about 60% and again before the freeze, not only once.

## Where applied

Points 1 to 5: `AGENTS.md` Phase 2 step 6, `DESIGN-PROMPT.md` (top note), `DEMO.md` (Timing and checks). Points 6 to 9: this file only; move 7 into `AGENTS.md` Phase 0 if Chao agrees.
