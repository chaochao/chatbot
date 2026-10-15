import { tool } from "ai";
import { z } from "zod";
import { getProcessReport } from "@/lib/process/findings";

const kinds = [
  "missing_security_review",
  "contract_before_security",
  "undocumented_step",
  "over_target",
] as const;

// Facts come from code (D3); the model only words the answer.
export const getFindings = tool({
  description:
    "List vendor-onboarding findings computed from the event log, with affected vendors and counts. Use for any question about which vendors deviate from the SOP, and for every count.",
  execute: ({ kind }) => {
    const report = getProcessReport();
    return {
      findings: report.findings
        .filter((f) => !kind || f.kind === kind)
        .map((f) => ({
          count: f.caseIds.length,
          kind: f.kind,
          summary: f.summary,
          title: f.title,
          total: report.totalCases,
          vendors: f.caseIds.map((id) => ({
            caseId: id,
            vendor: report.cases[id][0].vendor,
          })),
        })),
    };
  },
  inputSchema: z.object({ kind: z.enum(kinds).optional() }),
});

export const getVendorTimeline = tool({
  description:
    "Get one vendor's onboarding events in time order, plus the findings that mention it. Vendor is named like 'Vendor 11'.",
  execute: ({ vendor }) => {
    const report = getProcessReport();
    const name = vendor.replace(/\D/g, "").padStart(2, "0");
    const caseId = Object.keys(report.cases).find(
      (id) => report.cases[id][0].vendor === `Vendor ${name}`
    );
    if (!caseId) {
      return { error: `No vendor named "${vendor}" in the event log.` };
    }
    return {
      caseId,
      events: report.cases[caseId].map((e) => ({
        activity: e.activity,
        actor: e.actor,
        id: e.id,
        team: e.team,
        timestamp: e.timestamp,
        tool: e.tool,
      })),
      findingKinds: report.findings
        .filter((f) => f.caseIds.includes(caseId))
        .map((f) => f.kind),
      vendor: `Vendor ${name}`,
    };
  },
  inputSchema: z.object({ vendor: z.string().describe("e.g. 'Vendor 11'") }),
});
