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
}: {
  selectedKind?: Finding["kind"] | null;
  onSelect?: (finding: Finding) => void;
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
    <section aria-labelledby="findings-headline" className="flex flex-col">
      <p className="text-muted-foreground text-xs">
        Vendor onboarding · {data.totalCases} vendors · compared with{" "}
        {data.sopTitle}
      </p>
      <h1
        className="mt-1.5 text-balance font-semibold text-foreground text-xl tracking-tight md:text-2xl"
        id="findings-headline"
      >
        {data.headline}
      </h1>

      {data.findings.length === 0 ? (
        <p className="mt-6 rounded-xl border border-border/60 border-dashed p-6 text-muted-foreground text-sm">
          Every recorded vendor follows the SOP steps in order. Ask a question
          below to explore the records.
        </p>
      ) : (
        <ol className="mt-5 flex flex-col gap-2.5">
          {data.findings.map((finding) => (
            <li key={finding.kind}>
              <FindingCard
                finding={finding}
                onSelect={onSelect}
                selected={selectedKind === finding.kind}
                sopRule={data.sop.find((st) => st.number === finding.sopStep)}
                totalCases={data.totalCases}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function FindingCard({
  finding,
  selected,
  sopRule,
  totalCases,
  onSelect,
}: {
  finding: Finding;
  selected: boolean;
  sopRule?: SopStep;
  totalCases: number;
  onSelect?: (finding: Finding) => void;
}) {
  const handleClick = useCallback(
    () => onSelect?.(finding),
    [onSelect, finding]
  );
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl border border-border/60 bg-card px-4 py-3.5 text-left transition-[border-color,background-color,box-shadow] duration-200",
        "hover:border-border hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
        selected && "border-amber-500/60 bg-amber-500/5"
      )}
      onClick={handleClick}
      type="button"
    >
      <span
        aria-hidden
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full",
          SEVERITY_DOT[finding.severity]
        )}
      />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
          <span className="font-medium text-foreground text-sm">
            {finding.title}
          </span>
          <span className="text-muted-foreground text-xs tabular-nums">
            <span className="sr-only">
              {SEVERITY_LABEL[finding.severity]} priority.{" "}
            </span>
            {finding.caseIds.length} of {totalCases} vendors
          </span>
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
    </button>
  );
}
