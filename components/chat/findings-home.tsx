"use client";

import { ArrowRightIcon, RotateCwIcon } from "lucide-react";
import { useCallback } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Finding, ProcessReport, SopStep } from "@/lib/process/findings";
import { cn, fetcher } from "@/lib/utils";

const SEVERITY_LABEL: Record<Finding["severity"], string> = {
  high: "High",
  low: "Low",
  medium: "Medium",
};

const SEVERITY_DOT: Record<Finding["severity"], string> = {
  high: "bg-amber-500",
  low: "bg-muted-foreground/40",
  medium: "bg-amber-500/50",
};

export function useProcessReport() {
  return useSWR<ProcessReport>("/api/process", fetcher, {
    revalidateOnFocus: false,
  });
}

export function FindingsHome({
  selectedKind,
  onSelect,
  onDeselect,
  hideHeading = false,
}: {
  selectedKind?: Finding["kind"] | null;
  onSelect?: (finding: Finding) => void;
  onDeselect?: () => void;
  hideHeading?: boolean;
}) {
  const { data, error, isLoading, mutate } = useProcessReport();
  const retry = useCallback(() => mutate(), [mutate]);

  if (isLoading) {
    return (
      <div aria-busy="true" className="flex flex-col gap-3">
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-8 w-[28rem] max-w-full" />
        {[0, 1, 2, 3].map((i) => (
          <Skeleton className="h-[88px] w-full" key={i} />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-border/60 p-6 text-sm">
        <p className="font-medium text-foreground">
          Could not load the onboarding records.
        </p>
        <p className="mt-1 text-muted-foreground">
          Your chat still works. Try loading the findings again.
        </p>
        <Button className="mt-4" onClick={retry} size="sm" variant="outline">
          <RotateCwIcon className="size-3.5" /> Try again
        </Button>
      </div>
    );
  }

  return (
    <section aria-label="Ranked findings" className="flex flex-col">
      {!hideHeading && <FindingsHeading report={data} />}
      <p className="mt-4 text-muted-foreground text-xs">
        Ranked findings · select one to inspect the evidence
      </p>

      {data.findings.length === 0 ? (
        <p className="mt-6 rounded-xl border border-border/60 border-dashed p-6 text-muted-foreground text-sm">
          Every recorded vendor follows the SOP steps in order. Ask a question
          below to explore the records.
        </p>
      ) : (
        <ol className="mt-3 flex flex-col gap-2.5">
          {data.findings.map((finding, index) => (
            <li key={finding.kind}>
              <FindingCard
                finding={finding}
                number={index + 1}
                onDeselect={onDeselect}
                onSelect={onSelect}
                selected={selectedKind === finding.kind}
                sopRule={data.sop.find((st) => st.number === finding.sopStep)}
                totalCases={data.totalCases}
                vendors={finding.caseIds.map((id) => data.cases[id][0].vendor)}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function FindingsHeading({ report }: { report: ProcessReport }) {
  return (
    <header>
      <h1 className="text-balance font-semibold text-foreground text-xl tracking-tight md:text-2xl">
        {report.headline}
      </h1>
      <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
        Vendor onboarding · {report.totalCases} vendors · compared with{" "}
        {report.sopTitle}
      </p>
    </header>
  );
}

// Compact version of a finding card, for the sticky bar in a long chat.
export function FindingChip({
  finding,
  number,
  selected,
  onSelect,
  onDeselect,
}: {
  finding: Finding;
  number: number;
  selected: boolean;
  onSelect: (finding: Finding) => void;
  onDeselect: () => void;
}) {
  const handleClick = useCallback(
    () => (selected ? onDeselect() : onSelect(finding)),
    [selected, onDeselect, onSelect, finding]
  );
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors duration-200 motion-reduce:transition-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-amber-500/60 bg-amber-500/10 text-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      onClick={handleClick}
      type="button"
    >
      <span
        aria-hidden
        className={cn("size-2 rounded-full", SEVERITY_DOT[finding.severity])}
      />
      {number} · {finding.title}
    </button>
  );
}

function FindingCard({
  finding,
  selected,
  sopRule,
  totalCases,
  onSelect,
  onDeselect,
  number,
  vendors,
}: {
  finding: Finding;
  selected: boolean;
  sopRule?: SopStep;
  totalCases: number;
  onSelect?: (finding: Finding) => void;
  onDeselect?: () => void;
  number: number;
  vendors: string[];
}) {
  // Clicking the open card again closes the panel.
  const handleClick = useCallback(
    () => (selected && onDeselect ? onDeselect() : onSelect?.(finding)),
    [selected, onDeselect, onSelect, finding]
  );
  return (
    <div
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-xl border border-border/60 bg-card px-4 py-4 text-left transition-[border-color,background-color,box-shadow] duration-200",
        "focus-within:ring-2 focus-within:ring-ring motion-reduce:transition-none",
        selected
          ? "border-amber-500/60 bg-amber-500/5 hover:bg-amber-500/10"
          : "hover:border-border hover:bg-muted/40"
      )}
    >
      <span
        aria-hidden
        className="mt-0.5 text-xs text-muted-foreground tabular-nums"
      >
        {number}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
          <button
            aria-controls={selected ? "evidence-panel" : undefined}
            aria-expanded={selected}
            className="text-left font-medium text-foreground text-sm outline-none after:absolute after:inset-0 after:rounded-xl"
            id={`finding-${finding.kind}`}
            onClick={handleClick}
            type="button"
          >
            <span
              aria-hidden
              className={cn(
                "mr-2 inline-block size-2 rounded-full",
                SEVERITY_DOT[finding.severity]
              )}
            />
            {finding.title}
          </button>
          <span className="text-muted-foreground text-xs tabular-nums">
            <span className="sr-only">
              {SEVERITY_LABEL[finding.severity]} priority.{" "}
            </span>
            {finding.caseIds.length} of {totalCases} vendors
          </span>
        </span>
        <span className="mt-2 block text-xs text-muted-foreground">
          {vendors.join(", ")}
        </span>
        <span className="mt-1 block text-muted-foreground text-xs leading-relaxed">
          {sopRule
            ? `SOP step ${sopRule.number} · ${sopRule.name} ${sopRule.rule}`
            : finding.summary}
        </span>
      </span>
      <ArrowRightIcon
        aria-hidden
        className="mt-1 size-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
      />
    </div>
  );
}
