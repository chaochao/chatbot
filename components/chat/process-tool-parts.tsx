"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { ChatTools } from "@/lib/types";
import { useOpenEvidence } from "./evidence-overlay";
import { formatDate } from "./evidence-panel";

type Findings = ChatTools["getFindings"]["output"];
type Timeline = ChatTools["getVendorTimeline"]["output"];

function OpenButton({
  caseId,
  kind,
  label,
}: {
  caseId: string;
  kind?: string;
  label: string;
}) {
  const open = useOpenEvidence();
  const onClick = useCallback(
    () => kind && open?.(kind as never, caseId),
    [open, kind, caseId]
  );
  return (
    <Button
      className="h-7 rounded-full px-3 text-xs"
      disabled={!kind}
      onClick={onClick}
      size="sm"
      variant="outline"
    >
      {label}
    </Button>
  );
}

export function FindingsResult({ output }: { output: Findings }) {
  if (output.findings.length === 0) {
    return <p className="text-sm">No differences found.</p>;
  }
  return (
    <div className="flex w-[min(100%,560px)] flex-col gap-3">
      {output.findings.map((f) => (
        <section
          className="rounded-lg border border-border/60 bg-card p-3"
          key={f.kind}
        >
          <h3 className="font-medium text-sm">{f.title}</h3>
          <p className="text-muted-foreground text-xs">
            {f.count} of {f.total} vendors
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {f.vendors.map((v) => (
              <OpenButton
                caseId={v.caseId}
                key={v.caseId}
                kind={f.kind}
                label={v.vendor}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function TimelineResult({ output }: { output: Timeline }) {
  if ("error" in output) {
    return <p className="text-destructive text-sm">{output.error}</p>;
  }
  const [kind] = output.findingKinds;
  return (
    <section className="w-[min(100%,560px)] rounded-lg border border-border/60 bg-card p-3">
      <h3 className="font-medium text-sm">{output.vendor}</h3>
      <ol className="mt-2 flex flex-col gap-1 text-sm">
        {output.events.map((e) => (
          <li className="flex justify-between gap-3" key={e.id}>
            <span>{e.activity}</span>
            <span className="text-muted-foreground text-xs">
              {e.team} · {formatDate(e.timestamp)}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-muted-foreground text-xs">Sources</span>
        {output.events.map((e) => (
          <OpenButton
            caseId={output.caseId}
            key={e.id}
            kind={kind}
            label={`${e.tool} · ${formatDate(e.timestamp)}`}
          />
        ))}
      </div>
      {!kind && (
        <p className="mt-2 text-muted-foreground text-xs">
          No finding mentions this vendor, so there is no evidence view.
        </p>
      )}
    </section>
  );
}
