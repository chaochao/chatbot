"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Finding } from "@/lib/process/findings";
import { EvidencePanel, useCloseOnOutsideClick } from "./evidence-panel";
import { FindingsHome, useProcessReport } from "./findings-home";

type Open = (kind: Finding["kind"], caseId: string) => void;

const OpenEvidence = createContext<Open | null>(null);
export const useOpenEvidence = () => useContext(OpenEvidence);

const Selection = createContext<{ kind?: Finding["kind"]; close: () => void }>({
  close: () => undefined,
});

// Findings stay at the top of the conversation and open the same panel.
export function FindingsTop() {
  const open = useOpenEvidence();
  const { kind, close } = useContext(Selection);
  const onSelect = useCallback(
    (finding: Finding) => open?.(finding.kind, finding.caseIds[0]),
    [open]
  );
  return (
    <div className="border-border/60 border-b pb-6">
      <FindingsHome
        onDeselect={close}
        onSelect={onSelect}
        selectedKind={kind}
      />
    </div>
  );
}

// Chat answers open the same evidence panel as the findings home (D6).
export function EvidenceOverlay({ children }: { children: ReactNode }) {
  const { data } = useProcessReport();
  const [sel, setSel] = useState<{ kind: Finding["kind"]; caseId: string }>();
  const trigger = useRef<Element | null>(null);

  const open = useCallback<Open>((kind, caseId) => {
    trigger.current ??= document.activeElement;
    setSel({ caseId, kind });
  }, []);
  const close = useCallback(() => {
    setSel(undefined);
    const el = trigger.current as HTMLElement | null;
    trigger.current = null;
    requestAnimationFrame(() => el?.focus());
  }, []);
  const selectVendor = useCallback(
    (caseId: string) => setSel((s) => s && { ...s, caseId }),
    []
  );

  useCloseOnOutsideClick(!!sel, close);

  useEffect(() => {
    if (!sel) {
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel, close]);

  const finding = data?.findings.find((f) => f.kind === sel?.kind);
  return (
    <OpenEvidence.Provider value={open}>
      <Selection.Provider value={{ close, kind: sel?.kind }}>
        <div className="relative flex min-h-0 flex-1 flex-col">
          {children}
          {!!sel && !!data && !!finding && (
            <div className="absolute inset-y-0 right-0 z-20 flex w-full flex-col shadow-[var(--shadow-float)] md:w-[520px]">
              <EvidencePanel
                caseId={sel.caseId}
                finding={finding}
                findingNumber={data.findings.indexOf(finding) + 1}
                key={finding.kind}
                onClose={close}
                onSelectVendor={selectVendor}
                report={data}
              />
            </div>
          )}
        </div>
      </Selection.Provider>
    </OpenEvidence.Provider>
  );
}
