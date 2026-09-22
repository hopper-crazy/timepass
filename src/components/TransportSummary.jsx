import { Boxes, Bot, ScanSearch, ShieldCheck } from "lucide-react";

import AssessmentBadge from "./AssessmentBadge";

export default function TransportSummary({ data }) {
  const statuses = data.objects
    .filter((object) => object.object_type !== "FUGR")
    .map((object) => object.ai_overall_assessment?.status);

  const componentStatuses = data.objects.flatMap((object) =>
    object.object_type === "FUGR"
      ? (object.components || []).map(
          (component) => component.ai_overall_assessment?.status,
        )
      : [],
  );

  const allStatuses = [...statuses, ...componentStatuses];

  const overallStatus = allStatuses.includes("FAIL")
    ? "FAIL"
    : allStatuses.includes("WARNING")
      ? "WARNING"
      : "PASS";

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Metric
        icon={Boxes}
        label="Objects"
        value={data.total_objects}
        description="Transport objects"
      />

      <Metric
        icon={ScanSearch}
        label="ATC Findings"
        value={data.total_atc_findings}
        description="Static analysis"
      />

      <Metric
        icon={Bot}
        label="AI Findings"
        value={data.total_ai_findings}
        description="Review findings"
      />

      <div className="flex min-h-[84px] items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm shadow-slate-200/30">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Review Status
          </div>

          <div className="mt-2">
            <AssessmentBadge status={overallStatus} />
          </div>
        </div>

        <ShieldCheck size={21} className="text-slate-300" />
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, description }) {
  return (
    <div className="flex min-h-[84px] items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm shadow-slate-200/30">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[#12233f]">
        <Icon size={19} />
      </div>

      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          {label}
        </div>

        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-[#12233f]">
            {value}
          </span>

          <span className="hidden text-[10px] text-slate-400 xl:inline">
            {description}
          </span>
        </div>
      </div>
    </div>
  );
}
