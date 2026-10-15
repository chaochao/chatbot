import assert from "node:assert/strict";
import { test } from "node:test";
import { buildReport, getProcessReport, type ProcessEvent } from "./findings";

const sop = `# Vendor Onboarding — SOP (v3)
4. **Security review** (Security, in Vanta). **Required for every vendor. No exceptions.**
5. **Contract review** (Legal, in Ironclad). This starts only after security approves.
`;

const ev = (
  caseId: string,
  activity: string,
  day: number,
  id = `${caseId}-${day}`
): ProcessEvent => ({
  activity,
  actor: "A",
  caseId,
  id,
  team: "T",
  timestamp: `2026-07-${String(day).padStart(2, "0")}T10:00:00Z`,
  tool: "X",
  vendor: caseId,
});

test("classifies missing review, out-of-order and undocumented steps", () => {
  const report = buildReport(
    [
      ev("A", "Contract review", 1),
      ev("B", "Contract review", 1),
      ev("B", "Security review", 2),
      ev("C", "Security review", 1),
      ev("C", "Contract review", 2),
      ev("C", "Request more info", 3),
    ],
    sop
  );
  const byKind = Object.fromEntries(
    report.findings.map((f) => [f.kind, f.caseIds])
  );
  assert.deepEqual(byKind.missing_security_review, ["A"]);
  assert.deepEqual(byKind.contract_before_security, ["B"]);
  assert.deepEqual(byKind.undocumented_step, ["C"]);
  assert.equal(byKind.over_target, undefined);
  assert.equal(
    report.headline,
    "2 of 3 vendors have a possible gap in security review."
  );
  assert.equal(report.sop[0].rule.includes("No exceptions."), true);
});

test("empty data says no differences", () => {
  const report = buildReport([], sop);
  assert.equal(report.findings.length, 0);
  assert.match(report.headline, /No differences found/);
});

test("real fixture matches the numbers we demo", () => {
  const report = getProcessReport();
  const count = (kind: string) =>
    report.findings.find((f) => f.kind === kind)?.caseIds.length;
  assert.equal(report.totalCases, 60);
  assert.equal(count("missing_security_review"), 8);
  assert.equal(count("contract_before_security"), 8);
  assert.equal(count("undocumented_step"), 12);
  assert.equal(count("over_target"), 1);
  assert.equal(report.sop.length, 7);
});
