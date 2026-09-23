import {
  AlertCircle,
  ArrowLeft,
  Bot,
  Check,
  Code2,
  FileCode2,
  Loader2,
  RefreshCw,
  ScanSearch,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function AnalysisLoading({
  transportRequest,
  system,
  elapsed = 0,
  error = null,
  onRetry,
  onBack,
}) {
  const hasError = Boolean(error);

  // ============================================================
  // ANALYSIS STEPS
  // ============================================================

  const steps = [
    {
      title: "Connecting to SAP",
      description: `Connecting securely to ${system}`,
      icon: Server,
    },
    {
      title: "Reading transport",
      description: "Discovering transported development objects",
      icon: ScanSearch,
    },
    {
      title: "Extracting source",
      description: "Retrieving ABAP source and metadata",
      icon: FileCode2,
    },
    {
      title: "Processing ATC",
      description: "Collecting ABAP Test Cockpit findings",
      icon: ShieldCheck,
    },
    {
      title: "Preparing AI review",
      description: "Building code context for AI analysis",
      icon: Bot,
    },
  ];

  // ============================================================
  // PROGRESS
  // ============================================================

  const activeIndex = Math.min(Math.floor(elapsed / 2), steps.length - 1);

  const progress = Math.min(Math.max((elapsed / 10) * 100, 4), 96);

  // ============================================================
  // ERROR VIEW
  // ============================================================

  if (hasError) {
    return (
      <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#f5f7fa]">
        <PageBackground />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-[1100px] items-center justify-center px-5 py-12">
          <div className="w-full max-w-[720px]">
            {/* CONTEXT */}

            <div className="mb-5 flex justify-center">
              <TransportContext
                system={system}
                transportRequest={transportRequest}
              />
            </div>

            {/* ERROR CARD */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-[0_20px_60px_rgba(15,23,42,0.09)]
              "
            >
              <div className="h-1 bg-[#b11f2e]" />

              <div className="px-7 py-9 text-center md:px-10">
                {/* ICON */}

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-[#b11f2e]">
                  <AlertCircle size={27} />
                </div>

                <div className="mt-6 text-[9px] font-bold uppercase tracking-[0.2em] text-[#b11f2e]">
                  Analysis Interrupted
                </div>

                <h1 className="mt-2 text-[25px] font-bold tracking-[-0.025em] text-[#12233f]">
                  We couldn't complete this review
                </h1>

                <p className="mx-auto mt-3 max-w-[520px] text-[12px] leading-5 text-slate-500">
                  SPICE stopped processing this transport because SAP or the
                  review service returned an error.
                </p>

                {/* ERROR */}

                <div
                  className="
                    mx-auto
                    mt-7
                    max-w-[570px]
                    rounded-xl
                    border
                    border-red-100
                    bg-[#fff8f8]
                    p-4
                    text-left
                  "
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-[#b11f2e]">
                      <AlertCircle size={14} />
                    </div>

                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#b11f2e]">
                        Analysis details
                      </div>

                      <p className="mt-1.5 text-[12px] font-medium leading-5 text-slate-700">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onBack}
                    className="
                      flex
                      h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-5
                      text-[11px]
                      font-semibold
                      text-slate-600
                      transition-all

                      hover:border-slate-300
                      hover:bg-slate-50
                      hover:text-[#12233f]
                    "
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={onRetry}
                    className="
                      flex
                      h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-[#b11f2e]
                      px-6
                      text-[11px]
                      font-bold
                      text-white
                      shadow-sm
                      transition-all

                      hover:bg-[#981b28]
                      hover:shadow-md
                    "
                  >
                    <RefreshCw size={14} />
                    Retry Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // LOADING VIEW
  // ============================================================

  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#f5f7fa]">
      <PageBackground />

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[calc(100vh-64px)]
          max-w-[1250px]
          items-center
          px-5
          py-9

          lg:px-8
        "
      >
        <div className="w-full">
          {/* ==================================================
              PAGE INTRO
          ================================================== */}

          <div className="mb-7 text-center">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-slate-200
                bg-white/80
                px-3
                py-2
                shadow-sm
                backdrop-blur
              "
            >
              <Sparkles size={12} className="text-[#b11f2e]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                SPICE Analysis Engine
              </span>
            </div>

            <h1
              className="
                mt-4
                text-[30px]
                font-bold
                tracking-[-0.035em]
                text-[#12233f]

                md:text-[36px]
              "
            >
              Analyzing your SAP transport
            </h1>

            <p className="mx-auto mt-2 max-w-[620px] text-[12px] leading-5 text-slate-500">
              SPICE is inspecting the transport, source code, ATC findings and
              AI review context.
            </p>
          </div>

          {/* ==================================================
              MAIN WORKSPACE
          ================================================== */}

          <div
            className="
              overflow-hidden
              rounded-[20px]
              border
              border-slate-200
              bg-white
              shadow-[0_18px_55px_rgba(15,23,42,0.08)]
            "
          >
            {/* TOP BAR */}

            <div
              className="
                flex
                flex-col
                gap-4
                border-b
                border-slate-200
                bg-[#fbfcfd]
                px-6
                py-4

                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <TransportContext
                system={system}
                transportRequest={transportRequest}
              />

              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-emerald-600">
                  Analysis running
                </span>
              </div>
            </div>

            {/* CONTENT */}

            <div
              className="
                grid
                lg:grid-cols-[0.88fr_1.12fr]
              "
            >
              {/* ================================================
                  LEFT VISUAL
              ================================================ */}

              <div
                className="
                  relative
                  flex
                  min-h-[390px]
                  items-center
                  justify-center
                  overflow-hidden
                  border-b
                  border-slate-200
                  bg-[#f9fafc]
                  p-8

                  lg:border-b-0
                  lg:border-r
                "
              >
                {/* BACKGROUND RINGS */}

                <div className="absolute h-[310px] w-[310px] rounded-full border border-slate-200/70" />

                <div className="absolute h-[235px] w-[235px] rounded-full border border-slate-200" />

                <div className="absolute h-[160px] w-[160px] rounded-full border border-slate-200" />

                {/* SUBTLE ACCENTS */}

                <div className="absolute left-[20%] top-[25%] h-24 w-24 rounded-full bg-red-100/60 blur-3xl" />

                <div className="absolute bottom-[20%] right-[18%] h-28 w-28 rounded-full bg-blue-100/70 blur-3xl" />

                {/* CENTER ENGINE */}

                <div className="relative">
                  {/* ORBIT */}

                  <div className="absolute -inset-12 animate-[spin_8s_linear_infinite] rounded-full border border-dashed border-slate-300">
                    <div
                      className="
                        absolute
                        -top-2
                        left-1/2
                        flex
                        h-4
                        w-4
                        -translate-x-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-[#b11f2e]
                        shadow-[0_0_0_6px_rgba(177,31,46,0.08)]
                      "
                    />
                  </div>

                  {/* MAIN */}

                  <div
                    className="
                      relative
                      flex
                      h-32
                      w-32
                      items-center
                      justify-center
                      rounded-[28px]
                      border
                      border-slate-200
                      bg-white
                      shadow-[0_18px_45px_rgba(15,23,42,0.12)]
                    "
                  >
                    <div
                      className="
                        absolute
                        inset-3
                        rounded-[21px]
                        border
                        border-red-100
                        bg-gradient-to-br
                        from-red-50
                        via-white
                        to-blue-50
                      "
                    />

                    <div className="relative flex flex-col items-center">
                      <Code2
                        size={30}
                        strokeWidth={1.7}
                        className="text-[#b11f2e]"
                      />

                      <span className="mt-2 text-[10px] font-extrabold tracking-[0.15em] text-[#12233f]">
                        SPICE
                      </span>
                    </div>
                  </div>

                  {/* SAP */}

                  <FloatingNode
                    className="-left-[125px] top-[25px]"
                    icon={Server}
                    label={system}
                  />

                  {/* ATC */}

                  <FloatingNode
                    className="left-[88px] -top-[75px]"
                    icon={ShieldCheck}
                    label="ATC"
                  />

                  {/* AI */}

                  <FloatingNode
                    className="left-[105px] top-[115px]"
                    icon={Bot}
                    label="AI"
                  />
                </div>

                {/* CURRENT ACTION */}

                <div className="absolute bottom-7 left-6 right-6 text-center">
                  <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <Loader2
                      size={13}
                      className="animate-spin text-[#b11f2e]"
                    />

                    <span className="text-[10px] font-semibold text-slate-600">
                      {steps[activeIndex].description}
                    </span>
                  </div>
                </div>
              </div>

              {/* ================================================
                  RIGHT PIPELINE
              ================================================ */}

              <div className="p-6 md:p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Review Pipeline
                    </div>

                    <h2 className="mt-1.5 text-[17px] font-bold text-[#12233f]">
                      Preparing transport review
                    </h2>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-lg font-bold text-[#12233f]">
                      {Math.round(progress)}%
                    </div>

                    <div className="text-[8px] uppercase tracking-wider text-slate-400">
                      Complete
                    </div>
                  </div>
                </div>

                {/* PROGRESS */}

                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="
                      relative
                      h-full
                      rounded-full
                      bg-[#b11f2e]
                      transition-all
                      duration-700
                      ease-out
                    "
                    style={{
                      width: `${progress}%`,
                    }}
                  >
                    <div className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#b11f2e] shadow-[0_0_0_4px_rgba(177,31,46,0.10)]" />
                  </div>
                </div>

                {/* STEPS */}

                <div className="mt-6 space-y-1.5">
                  {steps.map((step, index) => {
                    const completed = index < activeIndex;

                    const active = index === activeIndex;

                    return (
                      <PipelineStep
                        key={step.title}
                        step={step}
                        completed={completed}
                        active={active}
                        number={index + 1}
                      />
                    );
                  })}
                </div>

                {/* FOOTER */}

                <div
                  className="
                    mt-6
                    flex
                    flex-col
                    gap-3
                    rounded-xl
                    border
                    border-slate-200
                    bg-[#f8fafc]
                    px-4
                    py-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={13} className="text-emerald-600" />

                    <span className="text-[9px] font-medium text-slate-500">
                      Secure read-only inspection
                    </span>
                  </div>

                  <div className="font-mono text-[9px] text-slate-400">
                    {elapsed < 10
                      ? `${elapsed}s elapsed`
                      : "Finalizing review..."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM MESSAGE */}

          <div className="mt-5 text-center">
            <p className="text-[9px] text-slate-400">
              You can leave this page open while SPICE completes the transport
              analysis.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// PIPELINE STEP
// ============================================================

function PipelineStep({ step, completed, active, number }) {
  const Icon = step.icon;

  return (
    <div
      className={`
        flex
        items-center
        gap-3.5
        rounded-xl
        border
        px-3.5
        py-3
        transition-all
        duration-300

        ${
          active
            ? "border-red-100 bg-red-50/60 shadow-sm"
            : "border-transparent"
        }
      `}
    >
      {/* STATUS */}

      <div
        className={`
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          transition-all

          ${
            completed
              ? "border-emerald-100 bg-emerald-50 text-emerald-600"
              : active
                ? "border-red-100 bg-white text-[#b11f2e]"
                : "border-slate-200 bg-[#f8fafc] text-slate-400"
          }
        `}
      >
        {completed ? (
          <Check size={14} strokeWidth={2.5} />
        ) : active ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Icon size={14} />
        )}
      </div>

      {/* TEXT */}

      <div className="min-w-0 flex-1">
        <div
          className={`
            text-[10px]
            font-semibold

            ${
              active
                ? "text-[#12233f]"
                : completed
                  ? "text-slate-600"
                  : "text-slate-400"
            }
          `}
        >
          {step.title}
        </div>

        <div
          className={`
            mt-0.5
            truncate
            text-[8px]

            ${active ? "text-slate-500" : "text-slate-400"}
          `}
        >
          {step.description}
        </div>
      </div>

      {/* RIGHT */}

      {completed ? (
        <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-emerald-600">
          Done
        </span>
      ) : active ? (
        <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#b11f2e]">
          Running
        </span>
      ) : (
        <span className="font-mono text-[9px] text-slate-300">0{number}</span>
      )}
    </div>
  );
}

// ============================================================
// TRANSPORT CONTEXT
// ============================================================

function TransportContext({ system, transportRequest }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-red-100
          bg-red-50
          text-[#b11f2e]
        "
      >
        <Server size={15} />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {system}
          </span>

          <span className="h-1 w-1 rounded-full bg-slate-300" />

          <span className="text-[9px] text-slate-400">SAP S/4HANA</span>
        </div>

        <div className="mt-0.5 font-mono text-[11px] font-bold tracking-wide text-[#12233f]">
          {transportRequest}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FLOATING NODE
// ============================================================

function FloatingNode({ icon: Icon, label, className = "" }) {
  return (
    <div
      className={`
        absolute
        flex
        min-w-[76px]
        items-center
        gap-2
        rounded-xl
        border
        border-slate-200
        bg-white
        px-3
        py-2.5
        shadow-[0_10px_30px_rgba(15,23,42,0.08)]

        ${className}
      `}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#f4f6f8] text-[#12233f]">
        <Icon size={12} />
      </div>

      <span className="text-[9px] font-bold text-[#12233f]">{label}</span>
    </div>
  );
}

// ============================================================
// PAGE BACKGROUND
// ============================================================

function PageBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* TOP WHITE GLOW */}

      <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-white to-transparent" />

      {/* RED */}

      <div className="absolute -left-40 top-24 h-[360px] w-[360px] rounded-full bg-red-100/45 blur-[110px]" />

      {/* BLUE */}

      <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-blue-100/50 blur-[120px]" />

      {/* GRID */}

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(18,35,63,1) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(18,35,63,1) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "44px 44px",
        }}
      />
    </div>
  );
}
