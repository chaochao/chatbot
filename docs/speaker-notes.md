# Speaker notes: Vendor Onboarding Investigator

Copied from the Claude Design deck (12 slides) on 2026-10-14 at about 19:50. The deck is the source; if you edit notes there, update this file.

Before presenting, fix these markers:
- Slide 3 has a placeholder: "[Say in one sentence what slice four covered.]"
- Slide 4 starts with "DRAFT": check the click script against `DEMO.md` (the demo steps in `DEMO.md` are the tested ones).
- Slide 8 says the reasons and costs are drafted: check them against `DECISIONS.md`.

## 1. Vendor Onboarding Investigator

Hi, I’m Chao. This is the Vendor Onboarding Investigator: a view for a leader that shows where real vendor onboarding differs from the written SOP. I’ll set up the problem and scope, do a five to seven minute live demo, then walk through the decisions behind it, what I haven’t measured yet, and the gaps. Most of our time after that is for your questions.

## 2. The problem

The person I designed for is a leader who wants to know how vendor onboarding really happens, not how the SOP says it happens. Their job is to decide which process issue to look at first, and to see the evidence before acting on it. The data here is 60 vendors and 419 events, compared against one SOP with seven steps and a ten-business-day target. The records live across several tools, Jira, email, Vanta, Ironclad, NetSuite and Slack, so a gap like contract review starting before security approves is hard to see by hand. That’s why it matters: the leader owns the process, and the gaps are risks they can’t see today.

## 3. Scope

Here’s what exists. Built: a findings home with a headline and ranked cards, an evidence panel, a next-step card that is advice only, and a chat that answers with cards and opens the same evidence panel. It handles Enter and Escape, and loading states. I cut two things on purpose: the mobile layout, and slice four. [Say in one sentence what slice four covered.] And some things are simply missing: the findings have not been reviewed by a person, and free-text questions the tools can’t answer only get a card back.

## 4. Live demo

DRAFT click-and-say script, written from the screenshots. Check it against DEMO.md before presenting. (1) Home is open. Say: the headline is computed in code, 16 of 60 vendors have a possible gap, and there are four ranked findings. (2) Click finding 1, No recorded security review. Say: the panel opens beside the list, written SOP steps on the left, what was recorded for Vendor 07 on the right. The dashed rows say No recorded event. Point at the footnote: missing records do not prove a step was missed. (3) Point at the next-step card: Security, Ana Silva, check Vanta. Say: advice only, nothing is sent. Click Copy, then Dismiss, then Undo. (4) Click finding 4, Over the 10-business-day target. Say: Vendor 11 waited 11 days between Security review and Contract review, and the wait marker shows where. (5) Press Escape to close the panel. Click the starter question What happened with Vendor 11. Say: the answer is a card from a tool, the seven steps with dates. Click the Vanta, July 19 source chip. Say: it opens the same evidence panel as the home. (6) Ask Which had contract review before security, scroll down. Say: the findings stay at the top as a compact bar.

## 5. Core experience

Two screens carry the product. On the left, the findings home: one headline, then four findings ranked, each with the vendors and the SOP step it relates to. On the right, the same home with finding 1 selected. The evidence panel opens beside the list, so the leader keeps their place. Written SOP steps sit on the left of the panel, recorded events on the right. Where nothing was recorded, the row is dashed and says No recorded event. Under it is the next-step card: who to ask, what to check, and why, with Copy and Dismiss. It is advice only.

## 6. Trust

Trust first. Every count and timeline comes from code, not the model. The checks are: does a security review event exist for the vendor; did contract review start before security approval; is there a Request more info step, which isn’t in the SOP; and did the vendor take longer than ten business days from request to notification. On screen is that last one: Vendor 11, with an 11-day wait between Security review and Contract review, marked in the panel. The limits matter as much as the checks. We say no recorded, never skipped, because missing records do not prove a step was missed, and a review event does not confirm approval. These findings have not been reviewed by a person. Nothing is ever sent; the next step is advice.

## 7. Architecture and data

Two inputs: the event log, 419 events across 60 vendors, and the SOP, seven steps with a ten-business-day target. Code compares them on the server and produces the findings. The model never counts. Those findings feed two surfaces. The findings home shows them directly. The chat has two tools: one returns the vendors for a finding, one returns a vendor’s timeline, and each answer is a card built from that data. Both surfaces open one evidence panel. This sits on a forked open-source chat app: Next.js, React, the AI SDK and Postgres.

## 8. Decisions

Four of six decisions, each with its reason and its cost. Reasons and costs below are drafted; check them before presenting. One: findings are computed in code and the model only explains them, because counts have to be right every time. The cost is that every new kind of finding needs code. Two: amber possible issue, not red violation, because a missing record isn’t proof of a missed step. The cost is that a real problem can look softer than it is. Three: the evidence panel opens beside the findings, with the selection kept in the URL, so the leader keeps their place and can share a link. The cost is less width for the list. Five: the card is the answer, so the model’s prose under it is hidden. That stopped the chat repeating the card. The cost is that a question no card matches gets no sentence at all. The other two: four, one evidence panel shared by the home and the chat, so evidence looks the same wherever you open it, at the cost of one component serving two contexts. Six, three fixed starter questions, so the demo path is reliable, at the cost of not adapting to the user.

## 9. From 10 to 10,000 records

I want to be clear about what I know here. What’s in place: findings are computed on the server, and the selection lives in the URL. What isn’t: today one response carries the whole report, all 60 vendors and all 419 events, with no limit and no paging. At 10,000 vendors that response would be huge, so paging is the first fix. I have not measured anything at scale. The plan is to seed 10,000 events, then measure two things: how long the findings call takes, and how the evidence table renders with that many rows. Until then, I can’t tell you how it performs at 10,000.

## 10. How we used AI

The AI scaffolded the app and built each slice from a plan I approved. I made the product calls, and I corrected it where it got things wrong. Three examples. The evidence panel couldn’t be closed by clicking outside it or on the open card. The chat repeated the card in prose and leaked an internal finding name. The sticky findings bar appeared too early. A human decided at three gates: I approved each slice plan, I walked each slice in the browser, and tests ran before merge.

## 11. Gaps and next steps

The biggest gap is that no person has reviewed these findings. The impact: a leader could act on a possible gap that turns out to be a missing record, not a missed step. The wording and the amber styling soften that, but they don’t remove it. Next, in order: protecting company data, which I did not do because this is sample data. Today anyone who opens the app, even as a guest, sees all 60 vendors. A real version shows data only to signed-in people in the right organization, and limits what each role can see. After that, a mobile layout, and a sentence from the model when a free-text question doesn’t match any card, since today those questions only get a card back.

## 12. What's next: from analysis to action

Today the product only analyzes. It shows findings and evidence and suggests a next step, but nothing is sent and nothing changes. Advice-only came first on purpose. The leader needs to trust a finding before acting on it, and missing records do not prove a step was missed, so acting automatically on a finding would be acting on something that might not be true. What I’d build next is a plan, not built and not measured. First, Draft: turn the suggested next step into a ready draft, like a message to the Security owner or a ticket for the vendor, that the leader can edit. Second, Approve: the leader reviews it and sends or dismisses it, with Undo and a record of who approved it. The AI never acts on its own. Third, Follow up: the finding shows its status, open, sent or resolved, and updates when new events arrive. Before any of that, there’s a gate: a human reviews each finding first. Happy to take questions.
