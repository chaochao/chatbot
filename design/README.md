# Core screen design

Claude Design file: https://claude.ai/design/p/0b382634-b3f7-4162-8702-4d40c7cc75da?file=Vendor+Onboarding.dc.html (3 clickable layouts + 4 state frames). Screens: `variants/`.

**Chosen: 1a — Findings home + evidence panel.**

| Criterion | 1a | 1b chat-native | 1c process map |
|---|---|---|---|
| Headline visible in 10 s | 3 | 2 | 2 |
| Every claim traceable in 1 click | 3 | 2 | 3 |
| Works at 3× data | 3 | 1 | 2 |
| Fits repo design system | 3 | 3 | 2 |
| Buildable in slice budget | 3 | 2 | 1 |
| **Total** | **15** | **10** | **10** |

Why 1a won: fastest to triage, findings stay comparable, and the core flow works without the model (brief: "findings usable if AI fails").
Taken from losers: 1c's idea of showing where the process breaks → optional thin SOP strip with deviation counts; 1b's in-thread cards → slice 3 reuses the same components in chat answers.
Not taken: the design's placeholder data (Vendor 07 dates, "+14 more vendors", summary-only for findings 3–4). The build uses real timelines for every affected vendor.
