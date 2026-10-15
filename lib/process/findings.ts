import { readFileSync } from "node:fs";
import { join } from "node:path";
import events from "@/data/events.json";
import { ACTIVITY_TO_STEP } from "./steps";

export type ProcessEvent = {
  id: string;
  caseId: string;
  vendor: string;
  activity: string;
  team: string;
  actor: string | null;
  tool: string;
  timestamp: string;
};

export type SopStep = {
  number: number;
  name: string;
  rule: string;
};

export type FindingKind =
  | "missing_security_review"
  | "contract_before_security"
  | "undocumented_step"
  | "over_target";

export type Finding = {
  kind: FindingKind;
  severity: "high" | "medium" | "low";
  title: string;
  summary: string;
  sopStep: number | null;
  caseIds: string[];
  // Per case: the event ids that show the problem (highlighted in the timeline).
  evidence: Record<string, string[]>;
  nextStep: { contact: string; verify: string; why: string };
};

export type ProcessReport = {
  sopTitle: string;
  sop: SopStep[];
  totalCases: number;
  headline: string;
  findings: Finding[];
  cases: Record<string, ProcessEvent[]>;
};

const TARGET_BUSINESS_DAYS = 10;

export function parseSop(markdown: string): {
  title: string;
  steps: SopStep[];
} {
  const title =
    markdown
      .match(/^# (.+)$/m)?.[1]
      ?.replace(/^Vendor Onboarding — Standard Operating Procedure/, "SOP") ??
    "SOP";
  const steps = [...markdown.matchAll(/^(\d+)\. \*\*(.+?)\*\* (.+)$/gm)].map(
    ([, n, name, rule]) => ({
      name,
      number: Number(n),
      rule: rule.replaceAll("**", ""),
    })
  );
  return { steps, title };
}

export function businessDaysBetween(startIso: string, endIso: string) {
  const day = new Date(startIso);
  const end = new Date(endIso);
  let count = 0;
  while (day < end) {
    day.setUTCDate(day.getUTCDate() + 1);
    const weekday = day.getUTCDay();
    if (weekday !== 0 && weekday !== 6) {
      count += 1;
    }
  }
  return count;
}

const ids = (list: ProcessEvent[], activity: string) =>
  list.filter((e) => e.activity === activity).map((e) => e.id);

export function buildReport(
  allEvents: ProcessEvent[],
  sopMarkdown: string
): ProcessReport {
  const { title, steps } = parseSop(sopMarkdown);
  const cases: Record<string, ProcessEvent[]> = {};
  for (const e of allEvents) {
    cases[e.caseId] ??= [];
    cases[e.caseId].push(e);
  }
  for (const list of Object.values(cases)) {
    list.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }
  const caseIds = Object.keys(cases).sort();
  const totalCases = caseIds.length;

  const missing: Finding = {
    caseIds: [],
    evidence: {},
    kind: "missing_security_review",
    nextStep: {
      contact: "Security (Ana Silva)",
      verify: "Check Vanta for a review that was done but not recorded.",
      why: "SOP step 4 requires a security review for every vendor.",
    },
    severity: "high",
    sopStep: 4,
    summary: "These vendors have no security review event in the records.",
    title: "No recorded security review",
  };
  const outOfOrder: Finding = {
    caseIds: [],
    evidence: {},
    kind: "contract_before_security",
    nextStep: {
      contact: "Legal (Rachel Green)",
      verify:
        "Ask why contract review started before security approval, and if Security signed off outside Vanta.",
      why: "SOP step 5 says contract review starts only after security approves.",
    },
    severity: "high",
    sopStep: 5,
    summary: "Contract review was recorded before the security review.",
    title: "Contract review before security approval",
  };
  const undocumented: Finding = {
    caseIds: [],
    evidence: {},
    kind: "undocumented_step",
    nextStep: {
      contact: "Procurement (Jin Park)",
      verify:
        "Ask what triggers a request for more info and whether the SOP should include it.",
      why: "This step happens often but is not in the SOP.",
    },
    severity: "medium",
    sopStep: null,
    summary: "A step that happens in practice but is not in the SOP.",
    title: "“Request more info” is not in the SOP",
  };
  const slow: Finding = {
    caseIds: [],
    evidence: {},
    kind: "over_target",
    nextStep: {
      contact: "Procurement (Jin Park)",
      verify: "Find which handoff took longest for these vendors.",
      why: `The SOP target is ${TARGET_BUSINESS_DAYS} business days end to end.`,
    },
    severity: "low",
    sopStep: null,
    summary: `Took more than ${TARGET_BUSINESS_DAYS} business days from request to notification.`,
    title: "Over the 10-business-day target",
  };

  for (const id of caseIds) {
    const list = cases[id];
    const security = ids(list, "Security review");
    const contract = ids(list, "Contract review");
    if (security.length === 0) {
      missing.caseIds.push(id);
      missing.evidence[id] = contract;
    } else if (contract.length > 0) {
      const firstContract = list.findIndex(
        (e) => e.activity === "Contract review"
      );
      const firstSecurity = list.findIndex(
        (e) => e.activity === "Security review"
      );
      if (firstContract < firstSecurity) {
        outOfOrder.caseIds.push(id);
        outOfOrder.evidence[id] = [...contract, ...security];
      }
    }
    const extra = list
      .filter((e) => !(e.activity in ACTIVITY_TO_STEP))
      .map((e) => e.id);
    if (extra.length > 0) {
      undocumented.caseIds.push(id);
      undocumented.evidence[id] = extra;
    }
    const [first] = list;
    const last = list.at(-1) ?? first;
    if (
      businessDaysBetween(first.timestamp, last.timestamp) >
      TARGET_BUSINESS_DAYS
    ) {
      slow.caseIds.push(id);
      slow.evidence[id] = [first.id, last.id];
    }
  }

  const findings = [missing, outOfOrder, undocumented, slow].filter(
    (f) => f.caseIds.length > 0
  );
  const securityGap = new Set([...missing.caseIds, ...outOfOrder.caseIds]).size;
  const headline =
    securityGap > 0
      ? `${securityGap} of ${totalCases} vendors have a possible gap in security review.`
      : `No differences found against ${title}.`;

  return {
    cases,
    findings,
    headline,
    sop: steps,
    sopTitle: title,
    totalCases,
  };
}

// ponytail: fixture read per call (419 events); move to Postgres + indexes past ~10k events (D3).
export function getProcessReport(): ProcessReport {
  const sop = readFileSync(
    join(process.cwd(), "data/vendor-onboarding-sop.md"),
    "utf8"
  );
  return buildReport(events as ProcessEvent[], sop);
}
