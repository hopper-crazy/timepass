import {
  AlertCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export default function ATCResults({ findings = [] }) {
  // ============================================================
  // EMPTY STATE
  // ============================================================

  if (!findings || findings.length === 0) {
    return (
      <div
        className="
          flex
          min-h-[420px]
          items-center
          justify-center
          rounded-xl
          border
          border-slate-200
          bg-white
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-emerald-50
              text-emerald-600
            "
          >
            <ShieldCheck size={22} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-[#12233f]">
            No ATC Findings
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            No ATC issues were detected for this object.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-3">
      {findings.map((finding, index) => {
        const severity = getSeverityConfig(finding?.severity);

        const lineNumber = Number(finding?.lineno);

        const hasValidLine = Number.isFinite(lineNumber) && lineNumber > 0;

        return (
          <div
            key={`${finding?.source || "atc"}-${index}`}
            className="
              overflow-hidden
              rounded-xl
              border
              border-slate-200
              bg-white
              transition-all
              duration-150

              hover:border-slate-300
              hover:shadow-sm
            "
          >
            {/* ==================================================
                MAIN FINDING
            ================================================== */}

            <div className="flex items-start gap-4 p-4">
              {/* SEVERITY ICON */}

              <div
                className={`
                  mt-0.5
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg

                  ${severity.iconBackground}
                  ${severity.iconColor}
                `}
              >
                <severity.Icon size={17} />
              </div>

              {/* FINDING CONTENT */}

              <div className="min-w-0 flex-1">
                {/* TOP ROW */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  {/* LEFT */}

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >
                    {/* SEVERITY */}

                    <span
                      className={`
                        rounded-md
                        px-2
                        py-1
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.08em]

                        ${severity.badge}
                      `}
                    >
                      {finding?.severity || "Information"}
                    </span>

                    {/* SOURCE */}

                    {finding?.source && (
                      <span
                        className="
                          text-[10px]
                          font-semibold
                          text-slate-400
                        "
                      >
                        {finding.source}
                      </span>
                    )}
                  </div>

                  {/* =================================================
                      LINE NUMBER

                      Display only.
                      No click.
                      No navigation.
                  ================================================= */}

                  {hasValidLine && (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-md
                        bg-slate-50
                        px-2
                        py-1.5
                        text-[10px]
                        font-medium
                        text-slate-500
                        select-none
                      "
                    >
                      <MapPin size={11} className="text-slate-400" />
                      Line {lineNumber}
                    </span>
                  )}
                </div>

                {/* MESSAGE */}

                <p
                  className="
                    mt-3
                    text-[13px]
                    font-semibold
                    leading-5
                    text-[#12233f]
                  "
                >
                  {finding?.message || "ATC finding"}
                </p>
              </div>
            </div>

            {/* ==================================================
                RECOMMENDATION
            ================================================== */}

            {finding?.recommendation && (
              <div
                className="
                  border-t
                  border-slate-100
                  bg-[#fafbfc]
                  px-4
                  py-3
                "
              >
                <div className="flex items-start gap-2.5">
                  <Lightbulb
                    size={14}
                    className="
                      mt-0.5
                      shrink-0
                      text-amber-500
                    "
                  />

                  <div>
                    <div
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.1em]
                        text-slate-400
                      "
                    >
                      Recommendation
                    </div>

                    <p
                      className="
                        mt-1
                        text-[11px]
                        leading-5
                        text-slate-600
                      "
                    >
                      {finding.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// SEVERITY CONFIGURATION
// ============================================================

function getSeverityConfig(severity = "") {
  const value = String(severity).toLowerCase();

  // ERROR / CRITICAL / HIGH

  if (value === "error" || value === "critical" || value === "high") {
    return {
      Icon: AlertCircle,
      iconBackground: "bg-red-50",
      iconColor: "text-red-600",
      badge: "bg-red-50 text-red-700",
    };
  }

  // WARNING / MEDIUM

  if (value === "warning" || value === "medium") {
    return {
      Icon: AlertTriangle,
      iconBackground: "bg-amber-50",
      iconColor: "text-amber-600",
      badge: "bg-amber-50 text-amber-700",
    };
  }

  // INFORMATION

  return {
    Icon: Info,
    iconBackground: "bg-blue-50",
    iconColor: "text-blue-600",
    badge: "bg-blue-50 text-blue-700",
  };
}
