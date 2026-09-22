import { CheckCircle2, FileQuestion } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  success = false,
}) {
  const DisplayIcon = Icon || (success ? CheckCircle2 : FileQuestion);

  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10">
      <div className="max-w-sm text-center">
        <div
          className={`mx-auto flex h-10 w-10 items-center justify-center rounded-lg ${
            success
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          <DisplayIcon size={19} />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-700">{title}</h3>

        <p className="mt-1.5 text-xs leading-5 text-slate-400">{description}</p>
      </div>
    </div>
  );
}
