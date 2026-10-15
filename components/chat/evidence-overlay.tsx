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
import { cn } from "@/lib/utils";
import { EvidencePanel, useCloseOnOutsideClick } from "./evidence-panel";
import { FindingChip, FindingsHome, useProcessReport } from "./findings-home";

type Open = (kind: Finding["kind"], caseId: string) => void;

const OpenEvidence = createContext<Open | null>(null);
export const useOpenEvidence = () => useContext(OpenEvidence);

const Selection = createContext<{ kind?: Finding["kind"]; close: () => void }>({
  close: () => undefined,
});

// Findings stay at the top of the conversation and open the same panel.
// Once the cards scroll away, a compact bar of the same findings sticks to the top.
export function FindingsTop() {
  const { data } = useProcessReport();
  const open = useOpenEvidence();
  const { kind, close } = useContext(Selection);
  const [cardsVisible, setCardsVisible] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const cardsRef = useCallback((node: HTMLDivElement | null) => {
    observer.current?.disconnect();
    if (node) {
      // Show the bar only once the whole list is out of view.
      observer.current = new IntersectionObserver(([entry]) =>
        setCardsVisible(entry.isIntersecting)
      );
      observer.current.observe(node);
    }
  }, []);
  const onSelect = useCallback(
    (finding: Finding) => open?.(finding.kind, finding.caseIds[0]),
    [open]
  );
  return (
    <>
      <div className="sticky top-0 z-10 -mb-5 h-0 md:-mb-7">
        {!!data && (
          <nav
            aria-label="Findings"
            className={cn(
              "flex gap-2 overflow-x-auto border-border/60 border-b bg-background py-2 transition-[opacity,visibility] duration-200 motion-reduce:transition-none",
              cardsVisible ? "invisible opacity-0" : "visible opacity-100"
            )}
          >
            {data.findings.map((finding, index) => (
              <FindingChip
                finding={finding}
                key={finding.kind}
                number={index + 1}
                onDeselect={close}
                onSelect={onSelect}
                selected={kind === finding.kind}
              />
            ))}
          </nav>
        )}
      </div>
      <div className="border-border/60 border-b pb-6" ref={cardsRef}>
        <FindingsHome
          onDeselect={close}
          onSelect={onSelect}
          selectedKind={kind}
        />
      </div>
    </>
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
    requestAnimationFrame(() => el?.focus({ preventScroll: true }));
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
