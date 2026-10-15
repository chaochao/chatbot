"use client";

import { useSearchParams } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useRef } from "react";
import type { Finding } from "@/lib/process/findings";
import { cn } from "@/lib/utils";
import { EvidencePanel } from "./evidence-panel";
import {
  FindingsHeading,
  FindingsHome,
  useProcessReport,
} from "./findings-home";

function updateSelection(finding?: string, vendor?: string) {
  const url = new URL(window.location.href);
  url.searchParams.delete("finding");
  url.searchParams.delete("vendor");
  if (finding) {
    url.searchParams.set("finding", finding);
  }
  if (vendor) {
    url.searchParams.set("vendor", vendor);
  }
  window.history.replaceState(null, "", url);
}

export function FindingsWorkspace({ footer }: { footer?: ReactNode }) {
  const { data } = useProcessReport();
  const params = useSearchParams();
  const finding = data?.findings.find(
    (item) => item.kind === params.get("finding")
  );
  const selectedCaseId =
    finding?.caseIds.find(
      (id) => data?.cases[id][0].vendor === params.get("vendor")
    ) ?? finding?.caseIds[0];
  const triggerRef = useRef<HTMLElement | null>(null);

  const selectFinding = useCallback((selected: Finding) => {
    triggerRef.current = document.getElementById(`finding-${selected.kind}`);
    updateSelection(selected.kind);
  }, []);

  const closePanel = useCallback(() => {
    const trigger =
      triggerRef.current ?? document.getElementById(`finding-${finding?.kind}`);
    updateSelection();
    requestAnimationFrame(() => trigger?.focus());
  }, [finding?.kind]);

  const selectVendor = useCallback(
    (caseId: string) => {
      if (finding && data) {
        updateSelection(finding.kind, data.cases[caseId][0].vendor);
      }
    },
    [finding, data]
  );

  useEffect(() => {
    if (!finding) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finding, closePanel]);

  return (
    <div className="@container flex h-full min-h-0 flex-col">
      {!!data && (
        <div className="shrink-0 border-b border-border/60 px-5 py-5 md:px-8">
          <FindingsHeading report={data} />
        </div>
      )}
      <div
        className={cn(
          "grid min-h-0 flex-1",
          finding && "@min-[900px]:grid-cols-[minmax(0,1fr)_520px]"
        )}
      >
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-col",
            finding && "hidden @min-[900px]:flex"
          )}
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-2 pb-6 md:px-8">
            <div className={cn("mx-auto", !finding && "max-w-3xl")}>
              <FindingsHome
                hideHeading
                onSelect={selectFinding}
                selectedKind={finding?.kind}
              />
            </div>
          </div>
          {footer}
        </div>
        {!!finding && !!data && !!selectedCaseId && (
          <EvidencePanel
            caseId={selectedCaseId}
            finding={finding}
            findingNumber={data.findings.indexOf(finding) + 1}
            key={finding.kind}
            onClose={closePanel}
            onSelectVendor={selectVendor}
            report={data}
          />
        )}
      </div>
    </div>
  );
}
