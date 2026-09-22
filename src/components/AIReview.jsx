import { useState } from "react";

import {
  Bot,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import AssessmentBadge from "./AssessmentBadge";
import EmptyState from "./EmptyState";

export default function AIReview({ findings = [], assessment }) {
  return (
    <div className="space-y-4">
      {assessment && (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/20">
          <div className="flex items-start gap-4 p-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#12233f] text-white">
              <Sparkles size={17} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    AI Overall Assessment
                  </div>

                  <div className="mt-1 text-sm font-semibold text-[#12233f]">
                    Code Review Summary
                  </div>
                </div>

                <AssessmentBadge status={assessment.status} />
              </div>

              <p className="mt-3 max-w-4xl text-xs leading-5 text-slate-600">
                {assessment.summary}
              </p>
            </div>
          </div>
        </section>
      )}

      {!findings.length ? (
        <EmptyState
          icon={Bot}
          title="No AI findings"
          description="No additional AI code-review findings were identified."
          success
        />
      ) : (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold text-[#12233f]">
                Review Findings
              </h3>

              <p className="mt-0.5 text-[11px] text-slate-400">
                {findings.length} recommendation
                {findings.length !== 1 ? "s" : ""}
              </p>
            </div>

            <Bot size={18} className="text-slate-300" />
          </div>

          <div className="divide-y divide-slate-100">
            {findings.map((finding, index) => (
              <Finding
                key={`${finding.category}-${index}`}
                finding={finding}
                index={index}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Finding({ finding, index }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-slate-50/80"
      >
        <span className="mt-0.5 text-slate-400">
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#b11f2e]">
              {finding.category}
            </span>

            <span className="text-slate-300">•</span>

            <span className="text-[10px] font-semibold uppercase text-slate-400">
              {finding.severity}
            </span>
          </div>

          <div className="mt-1.5 text-[13px] font-semibold leading-5 text-slate-800">
            {finding.findings}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="bg-slate-50/60 px-5 pb-5 pt-1">
          <div className="ml-7 grid gap-5 lg:grid-cols-2">
            <div>
              <Label>Analysis</Label>

              <p className="mt-1.5 text-xs leading-5 text-slate-600">
                {finding.comment}
              </p>
            </div>

            <div>
              <Label>
                <span className="flex items-center gap-1">
                  <Lightbulb size={11} />
                  Recommendation
                </span>
              </Label>

              <p className="mt-1.5 text-xs leading-5 text-slate-600">
                {finding.recommendation}
              </p>
            </div>
          </div>

          {finding.code_reference && (
            <div className="ml-7 mt-4">
              <Label>Code Reference</Label>

              <code className="mt-1.5 block overflow-x-auto rounded-lg border border-slate-700 bg-[#0D1524] px-3 py-2.5 font-mono text-[11px] text-slate-300">
                {finding.code_reference}
              </code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Label({ children }) {
  return (
    <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
      {children}
    </div>
  );
}
