"use client";

import { CopyIcon, XIcon } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  Finding,
  ProcessEvent,
  ProcessReport,
} from "@/lib/process/findings";
import { ACTIVITY_TO_STEP } from "@/lib/process/steps";
import { cn } from "@/lib/utils";
import { toast } from "./toast";

const REASON: Record<Finding["kind"], string> = {
  contract_before_security: "Contract before security",
  missing_security_review: "No recorded review",
  over_target: "Over the target",
  undocumented_step: "Not in SOP",
};

// Teams and tools named by the SOP; do not infer a policy tool from an event.
const SOP_CONTEXT: Record<number, string> = {
  1: "Requester · Jira",
  2: "Procurement",
  3: "Security · Email",
  4: "Security · Vanta",
  5: "Legal · Ironclad",
  6: "Finance · NetSuite",
  7: "Procurement",
};

const focusRing =
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none";
const accentText = "text-amber-800 dark:text-amber-300";

export function formatDate(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(timestamp));
}

const GAP_DAYS = 3;
const DAY_MS = 86_400_000;

// Clicking anywhere outside the panel (not on a button or link) closes it.
export function useCloseOnOutsideClick(active: boolean, close: () => void) {
  useEffect(() => {
    if (!active) {
      return;
    }
    function onPointerDown(event: PointerEvent) {
      if (
        event.target instanceof Element &&
        !event.target.closest("#evidence-panel, button, a, [role='button']")
      ) {
        close();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [active, close]);
}

export function EvidencePanel({
  finding,
  findingNumber,
  report,
  caseId,
  onClose,
  onSelectVendor,
}: {
  finding: Finding;
  findingNumber: number;
  report: ProcessReport;
  caseId: string;
  onClose: () => void;
  onSelectVendor: (caseId: string) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const events = report.cases[caseId];
  const { vendor } = events[0];
  const evidence = new Set(finding.evidence[caseId]);
  const extraEvents = events.filter(
    (event) => !ACTIVITY_TO_STEP[event.activity]
  );
  const gaps = new Map<number, { days: number; next: string }>();
  for (let i = 1; i < events.length; i += 1) {
    const step = ACTIVITY_TO_STEP[events[i - 1].activity];
    const days = Math.round(
      (Date.parse(events[i].timestamp) - Date.parse(events[i - 1].timestamp)) /
        DAY_MS
    );
    if (step && days >= GAP_DAYS) {
      gaps.set(step, { days, next: events[i].activity });
    }
  }

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <aside
      aria-labelledby="evidence-title"
      className="min-h-0 min-w-0 overflow-y-auto border-l border-border/60 bg-card p-4 animate-in slide-in-from-right-4 fade-in duration-200 motion-reduce:animate-none md:p-5 @min-[900px]:flex @min-[900px]:flex-col"
      id="evidence-panel"
    >
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">
            Evidence · finding {findingNumber}
          </p>
          <h2 className="mt-1 font-semibold text-sm" id="evidence-title">
            {finding.title}
          </h2>
        </div>
        <Button
          aria-label="Close evidence"
          className={focusRing}
          onClick={onClose}
          ref={closeRef}
          size="icon-sm"
          variant="ghost"
        >
          <XIcon aria-hidden className="size-4" />
        </Button>
      </div>

      <nav
        aria-label="Affected vendors"
        className="mt-4 flex shrink-0 gap-2 overflow-x-auto p-1 pb-3"
      >
        {finding.caseIds.map((id) => (
          <VendorChip
            caseId={id}
            key={id}
            name={report.cases[id][0].vendor}
            onSelect={onSelectVendor}
            reason={REASON[finding.kind]}
            selected={caseId === id}
          />
        ))}
      </nav>

      <div className="mt-1 overflow-hidden rounded-xl border border-border/70 @min-[900px]:min-h-0 @min-[900px]:flex-1 @min-[900px]:overflow-y-auto">
        <table className="w-full table-fixed text-left text-xs">
          <caption className="sr-only">
            SOP compared with recorded events for {vendor}. Dates are UTC.
          </caption>
          <thead className="sticky top-0 z-10 bg-muted text-muted-foreground">
            <tr>
              <th
                className="w-[44%] border-r border-border/60 px-3 py-3 font-normal"
                scope="col"
              >
                SOP v3 · written steps
              </th>
              <th
                aria-live="polite"
                className="px-3 py-3 font-normal"
                scope="col"
              >
                Observed · {vendor}
              </th>
            </tr>
          </thead>
          <tbody>
            {report.sop.map((step) => {
              const gap = gaps.get(step.number);
              const observed = events.filter(
                (event) => ACTIVITY_TO_STEP[event.activity] === step.number
              );
              return (
                <Fragment key={step.number}>
                  <tr className="border-t border-border/60 align-top">
                    <th
                      className="border-r border-border/60 px-3 py-3 font-normal"
                      id={`sop-step-${step.number}`}
                      scope="row"
                    >
                      <div className="flex gap-2">
                        <span className="text-muted-foreground">
                          {step.number}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{step.name}</p>
                          <p className="mt-1 text-muted-foreground">
                            {SOP_CONTEXT[step.number]}
                          </p>
                          {step.number === finding.sopStep && (
                            <blockquote
                              className={cn("mt-2 leading-relaxed", accentText)}
                            >
                              “{step.rule}”
                            </blockquote>
                          )}
                        </div>
                      </div>
                    </th>
                    <td className="px-2 py-2">
                      {observed.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border p-2.5">
                          <p className="font-medium">No recorded event</p>
                          <p className="mt-1 text-muted-foreground leading-relaxed">
                            Not found in the supplied records.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {observed.length > 1 && (
                            <p className="px-1 text-muted-foreground">
                              {observed.length === 2
                                ? "Recorded twice"
                                : `Recorded ${observed.length} times`}
                            </p>
                          )}
                          {observed.map((event) => (
                            <EventRecord
                              event={event}
                              highlighted={evidence.has(event.id)}
                              key={event.id}
                            />
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                  {step.number === 2 && extraEvents.length > 0 && (
                    <tr className="border-t border-border/60 align-top">
                      <th
                        className="border-r border-border/60 px-3 py-3 font-normal"
                        scope="row"
                      >
                        <Badge className={accentText} variant="outline">
                          Not in SOP
                        </Badge>
                        <p className="mt-2 text-muted-foreground leading-relaxed">
                          No matching written step.
                        </p>
                      </th>
                      <td className="space-y-2 px-2 py-2">
                        {extraEvents.map((event) => (
                          <EventRecord
                            event={event}
                            highlighted={evidence.has(event.id)}
                            key={event.id}
                            showActivity
                          />
                        ))}
                      </td>
                    </tr>
                  )}
                  {gap && (
                    <tr aria-label={`Waited ${gap.days} days`}>
                      <td
                        className={cn(
                          "border-t border-dashed border-border bg-muted/40 px-3 py-2 text-center",
                          accentText
                        )}
                        colSpan={2}
                      >
                        Waited {gap.days} days before {gap.next}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 shrink-0 text-xs text-muted-foreground leading-relaxed">
        Dates in UTC. Missing records do not prove a step was missed. Review
        events do not confirm approval.
      </p>
      <NextStepCard
        events={events.filter((event) => evidence.has(event.id))}
        finding={finding}
        key={caseId}
        vendor={vendor}
      />
    </aside>
  );
}

function VendorChip({
  caseId,
  name,
  reason,
  selected,
  onSelect,
}: {
  caseId: string;
  name: string;
  reason: string;
  selected: boolean;
  onSelect: (caseId: string) => void;
}) {
  const select = useCallback(() => onSelect(caseId), [caseId, onSelect]);
  const ref = useRef<HTMLButtonElement>(null);
  // Center the selected chip in the horizontal list (vertical scroll untouched).
  useEffect(() => {
    const chip = ref.current;
    const list = chip?.parentElement;
    if (selected && chip && list) {
      list.scrollLeft =
        chip.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2;
    }
  }, [selected]);
  return (
    <Button
      aria-pressed={selected}
      className={cn(
        "h-auto shrink-0 flex-col items-start gap-0.5 rounded-xl px-3 py-2 duration-200",
        focusRing
      )}
      onClick={select}
      ref={ref}
      variant={selected ? "default" : "outline"}
    >
      <span>{name}</span>
      <span
        className={cn(
          "text-[11px] font-normal",
          selected ? "text-primary-foreground/80" : "text-muted-foreground"
        )}
      >
        {reason}
      </span>
    </Button>
  );
}

function EventRecord({
  event,
  highlighted,
  showActivity = false,
}: {
  event: ProcessEvent;
  highlighted: boolean;
  showActivity?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-transparent p-2 leading-relaxed",
        highlighted && "border-amber-500/40 bg-amber-500/5"
      )}
      id={`event-${event.id}`}
    >
      {!!showActivity && <p className="mb-1 font-medium">{event.activity}</p>}
      <p className="font-medium text-sm">{event.actor ?? event.team}</p>
      <p className="text-muted-foreground">{event.team}</p>
      <p className="mt-1">
        {event.tool} ·{" "}
        <time dateTime={event.timestamp}>{formatDate(event.timestamp)}</time>
      </p>
      {!!highlighted && (
        <p className={cn("mt-1 text-[11px] font-medium", accentText)}>
          Evidence for this finding
        </p>
      )}
    </div>
  );
}

function NextStepCard({
  finding,
  vendor,
  events,
}: {
  finding: Finding;
  vendor: string;
  events: ProcessEvent[];
}) {
  const [dismissed, setDismissed] = useState(false);
  const [copying, setCopying] = useState(false);
  const copyRef = useRef<HTMLButtonElement>(null);
  const undoRef = useRef<HTMLButtonElement>(null);
  const dismiss = useCallback(() => {
    setDismissed(true);
    requestAnimationFrame(() => undoRef.current?.focus());
  }, []);
  const undo = useCallback(() => {
    setDismissed(false);
    requestAnimationFrame(() => copyRef.current?.focus());
  }, []);
  const copy = useCallback(async () => {
    setCopying(true);
    const sources = events
      .map((event) => `${event.tool} · ${formatDate(event.timestamp)}`)
      .join(", ");
    const sopSource = finding.sopStep
      ? `SOP step ${finding.sopStep}`
      : "SOP v3";
    const text = `${vendor} — ${finding.title}\nSuggested next step\nContact: ${finding.nextStep.contact}\nVerify: ${finding.nextStep.verify}\nWhy: ${finding.nextStep.why}\nSources: ${sources}; ${sopSource}\nAdvice only · nothing is sent`;
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: "Suggested next step copied. Nothing was sent.",
        type: "success",
      });
    } catch {
      toast({
        description:
          "Could not copy. Select the advice text and copy it manually.",
        type: "error",
      });
    } finally {
      setCopying(false);
    }
  }, [events, finding, vendor]);

  if (dismissed) {
    return (
      <div className="mt-4 flex shrink-0 items-center justify-between rounded-xl border border-border/70 p-3 text-xs">
        <p role="status">Suggestion dismissed for {vendor}.</p>
        <Button
          className={focusRing}
          onClick={undo}
          ref={undoRef}
          size="sm"
          variant="outline"
        >
          Undo
        </Button>
      </div>
    );
  }

  return (
    <section
      aria-label="Suggested next step"
      className="mt-4 shrink-0 rounded-xl border border-border/70 bg-muted/20 p-4 text-xs"
    >
      <div className="flex flex-wrap justify-between gap-1">
        <h3 className="font-semibold">Suggested next step</h3>
        <p className="text-muted-foreground">Advice only · nothing is sent</p>
      </div>
      <p className="mt-3 font-medium text-sm">{finding.nextStep.contact}</p>
      <p className="mt-2 leading-relaxed">
        For {vendor}: {finding.nextStep.verify}
      </p>
      <p className="mt-2 text-muted-foreground leading-relaxed">
        Why: {finding.nextStep.why}
      </p>
      <nav aria-label="Sources" className="mt-3 flex flex-wrap gap-1.5">
        {events.map((event) => (
          <a
            className={cn(
              "inline-flex items-center rounded-md border border-border bg-card px-2 py-1 text-xs hover:bg-muted",
              focusRing
            )}
            href={`#event-${event.id}`}
            key={event.id}
          >
            {event.tool} · {formatDate(event.timestamp)}
          </a>
        ))}
        {finding.sopStep ? (
          <a
            className={cn(
              "inline-flex items-center rounded-md border border-border bg-card px-2 py-1 text-xs hover:bg-muted",
              focusRing
            )}
            href={`#sop-step-${finding.sopStep}`}
          >
            SOP step {finding.sopStep}
          </a>
        ) : (
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-muted-foreground text-xs">
            SOP v3 ·{" "}
            {finding.kind === "over_target"
              ? "10-business-day target"
              : "steps 1–7"}
          </span>
        )}
      </nav>
      <div className="mt-4 flex items-center justify-between gap-2">
        <Button
          className={focusRing}
          disabled={copying}
          onClick={copy}
          ref={copyRef}
          size="sm"
        >
          <CopyIcon aria-hidden className="size-3.5" />
          {copying ? "Copying…" : "Copy"}
        </Button>
        <Button
          className={focusRing}
          onClick={dismiss}
          size="sm"
          variant="outline"
        >
          Dismiss
        </Button>
      </div>
    </section>
  );
}
