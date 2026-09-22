import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const config = {
  PASS: {
    classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Icon: CheckCircle2,
  },

  WARNING: {
    classes: "border-amber-200 bg-amber-50 text-amber-700",
    Icon: AlertTriangle,
  },

  FAIL: {
    classes: "border-red-200 bg-red-50 text-red-700",
    Icon: XCircle,
  },
};

export default function AssessmentBadge({ status }) {
  const normalized =
    status === "PASS" || status === "WARNING" || status === "FAIL"
      ? status
      : "WARNING";

  const { classes, Icon } = config[normalized];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-bold tracking-wide ${classes}`}
    >
      <Icon size={12} />
      {normalized}
    </span>
  );
}
