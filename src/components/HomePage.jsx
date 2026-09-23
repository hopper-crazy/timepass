import { useState } from "react";

import {
  ArrowRight,
  Bot,
  Braces,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  Cpu,
  FileSearch,
  Layers3,
  LockKeyhole,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { SAP_SYSTEMS } from "../utils/systems";

export default function HomePage({
  onAnalyze,
  loading = false,
  error = null,
  connected = false,
  checkingConnection = false,
  selectedSystem = "",
  setSelectedSystem,
}) {
  // ============================================================
  // TRANSPORT INPUT
  // ============================================================

  const [transport, setTransport] = useState("");

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    const transportRequest = transport.trim().toUpperCase();

    if (!transportRequest || loading) {
      return;
    }

    /*
     * SAP system validation is handled by App.js.
     *
     * We intentionally DO NOT disable submission when
     * selectedSystem is empty.
     *
     * This allows App.js to display:
     *
     * "Please select an SAP system."
     */

    onAnalyze(transportRequest);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f6f8fb]">
      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#0b1729]">
        {/* ====================================================
            BACKGROUND
        ==================================================== */}

        <div className="pointer-events-none absolute inset-0">
          {/* RED GLOW */}

          <div
            className="
              absolute
              -left-32
              -top-40
              h-[520px]
              w-[520px]
              rounded-full
              bg-[#c51f32]/20
              blur-[110px]
            "
          />

          {/* BLUE GLOW */}

          <div
            className="
              absolute
              -right-24
              top-10
              h-[500px]
              w-[500px]
              rounded-full
              bg-blue-500/10
              blur-[120px]
            "
          />

          {/* CENTER GLOW */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-[350px]
              w-[700px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-white/[0.025]
              blur-[80px]
            "
          />

          {/* TECHNICAL GRID */}

          <div
            className="
              absolute
              inset-0
              opacity-[0.06]
            "
            style={{
              backgroundImage: `
                linear-gradient(
                  rgba(255,255,255,0.6) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(255,255,255,0.6) 1px,
                  transparent 1px
                )
              `,
              backgroundSize: "48px 48px",
            }}
          />

          {/* BOTTOM FADE */}

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-52
              bg-gradient-to-t
              from-[#0b1729]
              to-transparent
            "
          />
        </div>

        {/* ====================================================
            HERO CONTENT
        ==================================================== */}

        <div
          className="
            relative
            mx-auto
            grid
            max-w-[1500px]
            items-center
            gap-12
            px-6
            pb-28
            pt-20

            lg:grid-cols-[1.05fr_0.95fr]
            lg:px-10
            lg:pb-32
            lg:pt-24

            xl:px-14
          "
        >
          {/* ==================================================
              LEFT
          ================================================== */}

          <div className="max-w-3xl">
            {/* LABEL */}

            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-2.5
                rounded-md
                border
                border-white/10
                bg-white/[0.05]
                px-3
                py-2
                backdrop-blur-sm
              "
            >
              <span
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded
                  bg-[#c51f32]
                "
              >
                <Code2 size={13} className="text-white" />
              </span>

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-slate-300
                "
              >
                SAP Development Governance
              </span>
            </div>

            {/* TITLE */}

            <h1
              className="
                max-w-[850px]
                text-[44px]
                font-bold
                leading-[1.05]
                tracking-[-0.035em]
                text-white

                md:text-[54px]
                xl:text-[62px]
              "
            >
              Smarter SAP code
              <br />
              <span
                className="
                  bg-gradient-to-r
                  from-white
                  via-slate-200
                  to-slate-400
                  bg-clip-text
                  text-transparent
                "
              >
                review starts here.
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-6
                max-w-2xl
                text-[15px]
                leading-7
                text-slate-400
              "
            >
              SPICE brings SAP source inspection, ABAP Test Cockpit findings and
              AI-assisted code review into one focused governance experience for
              SAP S/4HANA development.
            </p>

            {/* FULL NAME */}

            <div className="mt-7 flex items-center gap-3">
              <div className="h-px w-8 bg-[#c51f32]" />

              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-slate-500
                "
              >
                SAP Program Inspection and Code Evaluation
              </p>
            </div>

            {/* CAPABILITIES */}

            <div
              className="
                mt-9
                flex
                flex-wrap
                gap-x-7
                gap-y-3
              "
            >
              <HeroCapability text="ATC Analysis" />

              <HeroCapability text="AI Code Review" />

              <HeroCapability text="ABAP Inspection" />

              <HeroCapability text="Transport Review" />
            </div>
          </div>

          {/* ==================================================
              RIGHT - PRODUCT PREVIEW
          ================================================== */}

          <div className="relative hidden lg:block">
            {/* DECORATIVE FRAMES */}

            <div
              className="
                absolute
                -inset-5
                rounded-[28px]
                border
                border-white/[0.04]
              "
            />

            <div
              className="
                absolute
                -inset-10
                rounded-[36px]
                border
                border-white/[0.025]
              "
            />

            {/* APPLICATION MOCKUP */}

            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#101d30]/95
                shadow-[0_30px_80px_rgba(0,0,0,0.35)]
                backdrop-blur-xl
              "
            >
              {/* WINDOW HEADER */}

              <div
                className="
                  flex
                  h-12
                  items-center
                  justify-between
                  border-b
                  border-white/[0.07]
                  px-4
                "
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#c51f32]" />

                  <span className="h-2 w-2 rounded-full bg-slate-600" />

                  <span className="h-2 w-2 rounded-full bg-slate-600" />
                </div>

                <div
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-slate-600
                  "
                >
                  SPICE Review Workspace
                </div>
              </div>

              {/* MOCK WORKSPACE */}

              <div className="grid grid-cols-[145px_1fr]">
                {/* OBJECT TREE */}

                <div
                  className="
                    border-r
                    border-white/[0.06]
                    bg-[#0c1728]
                    p-3
                  "
                >
                  <div className="mb-4 h-2 w-20 rounded bg-slate-700/70" />

                  <MockObject active />

                  <MockObject />

                  <MockObject short />

                  <MockObject />
                </div>

                {/* CODE SIDE */}

                <div className="min-w-0">
                  {/* TABS */}

                  <div
                    className="
                      flex
                      h-10
                      items-center
                      gap-5
                      border-b
                      border-white/[0.06]
                      px-4
                    "
                  >
                    <span
                      className="
                        border-b-2
                        border-[#c51f32]
                        py-3
                        text-[8px]
                        font-bold
                        text-white
                      "
                    >
                      SOURCE
                    </span>

                    <span className="text-[8px] font-medium text-slate-600">
                      ATC CHECKS
                    </span>

                    <span className="text-[8px] font-medium text-slate-600">
                      AI REVIEW
                    </span>
                  </div>

                  {/* MOCK SOURCE */}

                  <div
                    className="
                      relative
                      h-[270px]
                      overflow-hidden
                      bg-[#091321]
                      px-5
                      py-5
                      font-mono
                      text-[9px]
                      leading-[19px]
                    "
                  >
                    <CodeLine
                      number="01"
                      keyword="CLASS"
                      text=" zcl_r2r_posting_service DEFINITION."
                    />

                    <CodeLine number="02" keyword="  PUBLIC SECTION." />

                    <CodeLine
                      number="03"
                      keyword="    METHODS"
                      text=" validate_document."
                    />

                    <CodeLine number="04" keyword="ENDCLASS." />

                    <br />

                    <CodeLine
                      number="06"
                      keyword="CLASS"
                      text=" zcl_r2r_posting_service IMPLEMENTATION."
                    />

                    <br />

                    <CodeLine
                      number="08"
                      keyword="  METHOD"
                      text=" validate_document."
                    />

                    <CodeLine number="09" keyword="    SELECT" text=" bukrs" />

                    <CodeLine number="10" keyword="      FROM" text=" t001" />

                    <CodeLine
                      number="11"
                      keyword="      INTO"
                      text=" @DATA(lv_bukrs)"
                    />

                    <CodeLine
                      number="12"
                      keyword="      WHERE"
                      text=" bukrs = @lv_company_code."
                    />

                    <br />

                    <CodeLine
                      number="14"
                      keyword="    IF"
                      text=" sy-subrc = 0."
                    />

                    <CodeLine
                      number="15"
                      text="      rv_success = "
                      keyword="abap_true"
                      keywordLast
                    />

                    <CodeLine number="16" keyword="    ENDIF." />

                    <CodeLine number="17" keyword="  ENDMETHOD." />

                    {/* AI STATUS */}

                    <div
                      className="
                        absolute
                        right-4
                        top-[150px]
                        flex
                        items-center
                        gap-2
                        rounded-md
                        border
                        border-emerald-500/20
                        bg-emerald-500/10
                        px-2.5
                        py-1.5
                        text-[8px]
                        font-semibold
                        text-emerald-400
                      "
                    >
                      <CheckCircle2 size={11} />
                      Review complete
                    </div>
                  </div>

                  {/* STATUS BAR */}

                  <div
                    className="
                      flex
                      h-8
                      items-center
                      justify-between
                      border-t
                      border-white/[0.06]
                      bg-[#101d30]
                      px-4
                      text-[8px]
                      text-slate-600
                    "
                  >
                    <span>ABAP</span>

                    <span>AI-assisted review</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FLOATING AI CARD */}

            <div
              className="
                absolute
                -bottom-5
                -left-8
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-white/10
                bg-[#14243a]
                px-4
                py-3
                shadow-2xl
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#c51f32]/15
                  text-[#ef6574]
                "
              >
                <Sparkles size={15} />
              </div>

              <div>
                <div className="text-[10px] font-semibold text-white">
                  AI Code Review
                </div>

                <div className="mt-0.5 text-[8px] text-slate-500">
                  Context-aware ABAP analysis
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          ANALYSIS CARD
      ====================================================== */}

      <section
        className="
          relative
          z-20
          mx-auto
          -mt-14
          max-w-[1180px]
          px-5
          pb-12
        "
      >
        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-[0_18px_55px_rgba(15,23,42,0.10)]
          "
        >
          <div
            className="
              grid
              gap-0
              lg:grid-cols-[1fr_330px]
            "
          >
            {/* ==================================================
                TRANSPORT INPUT
            ================================================== */}

            <div className="p-7 md:p-8">
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-50
                    text-[#b11f2e]
                  "
                >
                  <FileSearch size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold tracking-tight text-[#12233f]">
                    Analyze Transport Request
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Select the target SAP system and enter a transport request
                    to inspect its development objects, source code, ATC
                    findings and AI review.
                  </p>
                </div>
              </div>

              {/* FORM */}

              <form onSubmit={handleSubmit} className="mt-6">
                <label
                  htmlFor="transportRequest"
                  className="
                    mb-2
                    block
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-slate-500
                  "
                >
                  Transport Request
                </label>

                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                  "
                >
                  {/* INPUT */}

                  <div className="relative flex-1">
                    <Search
                      size={16}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      id="transportRequest"
                      type="text"
                      value={transport}
                      onChange={(event) =>
                        setTransport(event.target.value.toUpperCase())
                      }
                      placeholder="e.g. DS4K900123"
                      autoComplete="off"
                      spellCheck="false"
                      className="
                        h-12
                        w-full
                        rounded-lg
                        border
                        border-slate-200
                        bg-[#f8fafc]
                        pl-11
                        pr-4
                        font-mono
                        text-sm
                        font-semibold
                        tracking-wide
                        text-[#12233f]
                        outline-none
                        transition-all

                        placeholder:font-normal
                        placeholder:tracking-normal
                        placeholder:text-slate-400

                        hover:border-slate-300

                        focus:border-[#b11f2e]/40
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#b11f2e]/[0.06]
                      "
                    />
                  </div>

                  {/* ANALYZE */}

                  <button
                    type="submit"
                    disabled={loading || !transport.trim()}
                    className="
                      flex
                      h-12
                      min-w-[175px]
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-[#b11f2e]
                      px-5
                      text-xs
                      font-bold
                      text-white
                      shadow-sm
                      transition-all
                      duration-150

                      hover:bg-[#981b28]
                      hover:shadow-md

                      active:translate-y-px

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {loading ? (
                      <>
                        <span
                          className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-white/30
                            border-t-white
                          "
                        />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Transport
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>

                {/* CONNECTION WARNING */}

                {!checkingConnection && !connected && (
                  <div
                    className="
                        mt-3
                        rounded-lg
                        border
                        border-amber-200
                        bg-amber-50
                        px-4
                        py-3
                        text-[11px]
                        text-amber-800
                      "
                  >
                    SAP connection is currently unavailable. Transport analysis
                    may not be available until the connection is restored.
                  </div>
                )}

                {/* ERROR */}

                {error && (
                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-red-200
                      bg-red-50
                      px-4
                      py-3
                      text-xs
                      font-medium
                      text-red-700
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        bg-red-500
                      "
                    />

                    {error}
                  </div>
                )}
              </form>
            </div>

            {/* ==================================================
                ENVIRONMENT
            ================================================== */}

            <div
              className="
                border-t
                border-slate-200
                bg-[#f8fafc]
                p-7

                lg:border-l
                lg:border-t-0
              "
            >
              <div
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-slate-400
                "
              >
                Environment
              </div>

              {/* ==================================================
                  SAP SYSTEM SELECTOR
              ================================================== */}

              <div className="mt-5">
                <div className="mb-2 flex items-center gap-2">
                  <Server size={13} className="text-slate-400" />

                  <label
                    htmlFor="sapSystem"
                    className="
                      text-[10px]
                      font-medium
                      text-slate-500
                    "
                  >
                    SAP System
                  </label>

                  <span className="text-[10px] font-bold text-[#b11f2e]">
                    *
                  </span>
                </div>

                <div className="relative">
                  <select
                    id="sapSystem"
                    value={selectedSystem}
                    onChange={(event) => setSelectedSystem(event.target.value)}
                    disabled={loading}
                    className="
                      h-11
                      w-full
                      cursor-pointer
                      appearance-none
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      pl-3.5
                      pr-10
                      text-[11px]
                      font-semibold
                      text-[#12233f]
                      outline-none
                      transition-all
                      duration-150

                      hover:border-slate-300

                      focus:border-[#b11f2e]/40
                      focus:ring-4
                      focus:ring-[#b11f2e]/[0.06]

                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                      disabled:text-slate-400
                    "
                  >
                    <option value="">Select SAP system</option>

                    {SAP_SYSTEMS.map((system) => (
                      <option key={system.value} value={system.value}>
                        {system.label} — {system.description}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={14}
                    className="
                      pointer-events-none
                      absolute
                      right-3.5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />
                </div>

                {/* SELECTED SYSTEM */}

                {selectedSystem && (
                  <div
                    className="
                      mt-2.5
                      flex
                      items-center
                      gap-2
                      text-[9px]
                      text-slate-400
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-emerald-500
                      "
                    />
                    Target system
                    <span
                      className="
                        font-bold
                        text-slate-600
                      "
                    >
                      {selectedSystem}
                    </span>
                  </div>
                )}
              </div>

              {/* DIVIDER */}

              <div className="my-5 h-px bg-slate-200" />

              {/* ENVIRONMENT DETAILS */}

              <div className="space-y-4">
                <EnvironmentRow
                  icon={Cpu}
                  label="Platform"
                  value="SAP S/4HANA"
                />

                <EnvironmentRow
                  icon={LockKeyhole}
                  label="Review Mode"
                  value="Read Only"
                />

                <EnvironmentRow icon={Zap} label="Analysis" value="ATC + AI" />

                <EnvironmentRow
                  icon={ShieldCheck}
                  label="Purpose"
                  value="Code Governance"
                />
              </div>

              <div className="my-5 h-px bg-slate-200" />

              {/* GOVERNANCE */}

              <div
                className="
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  p-3
                "
              >
                <div className="flex items-start gap-2.5">
                  <ShieldCheck
                    size={14}
                    className="
                      mt-0.5
                      shrink-0
                      text-[#b11f2e]
                    "
                  />

                  <div>
                    <div
                      className="
                        text-[10px]
                        font-semibold
                        text-[#12233f]
                      "
                    >
                      Governance Workspace
                    </div>

                    <p
                      className="
                        mt-1
                        text-[9px]
                        leading-4
                        text-slate-400
                      "
                    >
                      Centralized transport inspection for SAP development
                      quality and review.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            FEATURES
        ==================================================== */}

        <div
          className="
            mt-6
            grid
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white

            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          <FeatureItem
            icon={Layers3}
            title="Transport Inspection"
            text="Review development objects in one workspace."
          />

          <FeatureItem
            icon={ShieldCheck}
            title="ATC Findings"
            text="Surface SAP quality and compliance findings."
          />

          <FeatureItem
            icon={Bot}
            title="AI Code Review"
            text="Inspect actionable code-level recommendations."
          />

          <FeatureItem
            icon={Braces}
            title="ABAP Source"
            text="Developer-focused source inspection experience."
            last
          />
        </div>
      </section>
    </main>
  );
}

// ============================================================
// HERO CAPABILITY
// ============================================================

function HeroCapability({ text }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
      <CheckCircle2 size={13} className="text-emerald-400" />

      <span>{text}</span>
    </div>
  );
}

// ============================================================
// MOCK OBJECT
// ============================================================

function MockObject({ active = false, short = false }) {
  return (
    <div
      className={`
        mb-2
        rounded-md
        px-2
        py-2.5

        ${active ? "border-l-2 border-[#c51f32] bg-white/[0.06]" : ""}
      `}
    >
      <div
        className={`
          h-1.5
          rounded

          ${active ? "bg-slate-400" : "bg-slate-700"}

          ${short ? "w-16" : "w-24"}
        `}
      />

      <div className="mt-2 h-1 w-12 rounded bg-slate-700/70" />
    </div>
  );
}

// ============================================================
// MOCK CODE LINE
// ============================================================

function CodeLine({ number, keyword, text = "", keywordLast = false }) {
  return (
    <div className="flex">
      <span className="mr-4 w-4 select-none text-right text-slate-700">
        {number}
      </span>

      <span>
        {keywordLast ? (
          <>
            <span className="text-slate-300">{text}</span>

            <span className="font-semibold text-[#53c7ff]">{keyword}</span>
          </>
        ) : (
          <>
            <span className="font-semibold text-[#53c7ff]">{keyword}</span>

            <span className="text-slate-300">{text}</span>
          </>
        )}
      </span>
    </div>
  );
}

// ============================================================
// ENVIRONMENT ROW
// ============================================================

function EnvironmentRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-[10px] text-slate-500">
        <Icon size={13} className="text-slate-400" />

        {label}
      </div>

      <span className="text-[10px] font-semibold text-slate-700">{value}</span>
    </div>
  );
}

// ============================================================
// FEATURE
// ============================================================

function FeatureItem({ icon: Icon, title, text, last = false }) {
  return (
    <div
      className={`
        group
        relative
        p-5
        transition-colors

        hover:bg-slate-50

        ${!last ? "border-b border-slate-200 sm:border-b-0 sm:border-r" : ""}
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-slate-100
            text-[#12233f]
            transition-colors

            group-hover:bg-[#12233f]
            group-hover:text-white
          "
        >
          <Icon size={14} />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-[11px] font-bold text-[#12233f]">{title}</h3>

            <ChevronRight
              size={11}
              className="
                text-slate-300
                transition-transform
                group-hover:translate-x-0.5
              "
            />
          </div>

          <p className="mt-1 text-[10px] leading-4 text-slate-400">{text}</p>
        </div>
      </div>
    </div>
  );
}
