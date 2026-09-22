import { useEffect, useState } from "react";

import { Bot, Box, Code2, FileCode2, ScanSearch } from "lucide-react";

import AssessmentBadge from "./AssessmentBadge";
import SourceCodeViewer from "./SourceCodeViewer";
import ATCResults from "./ATCResults";
import AIReview from "./AIReview";

import { getObjectTypeLabel } from "../utils/objectTypes";

export default function ObjectDetails({ selection }) {
  const [activeTab, setActiveTab] = useState("source");

  const { object, component, type } = selection || {};

  const isComponent = type === "component";

  const isFunctionGroupParent =
    type === "object" && object?.object_type === "FUGR";

  // ============================================================
  // RESET TAB WHEN SELECTED ITEM CHANGES
  // ============================================================

  useEffect(() => {
    setActiveTab("source");
  }, [type, object?.object_name, component?.component_name]);

  // ============================================================
  // EMPTY SELECTION
  // ============================================================

  if (!object) {
    return (
      <section
        className="
          flex
          h-full
          min-h-0
          min-w-0
          items-center
          justify-center

          rounded-xl
          border
          border-slate-200
          bg-white

          shadow-sm
          shadow-slate-200/30
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
              bg-slate-100
              text-slate-400
            "
          >
            <FileCode2 size={22} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-[#12233f]">
            Select an object
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Select a transport object to inspect its details.
          </p>
        </div>
      </section>
    );
  }

  // ============================================================
  // DISPLAY VALUES
  // ============================================================

  const displayName = isComponent
    ? component?.component_name
    : object.object_name;

  const displayType = isComponent
    ? component?.component_type
    : object.object_type;

  const sourceCode = isComponent ? component?.source_code : object.source_code;

  const assessment = isComponent
    ? component?.ai_overall_assessment
    : object.ai_overall_assessment;

  const aiFindings = isComponent
    ? component?.ai_code_review || []
    : object.ai_code_review || [];

  // ============================================================
  // BUILD TABS
  // ============================================================

  const tabs = [
    {
      id: "source",
      label: "Source Code",
      Icon: Code2,
    },
  ];

  /*
   * ATC belongs to the MAIN transport object.
   *
   * Normal object:
   * Source Code | ATC Checks | AI Code Review
   *
   * Function Group parent:
   * Source Code | ATC Checks
   *
   * Function Group component:
   * Source Code | AI Code Review
   */

  if (!isComponent) {
    tabs.push({
      id: "atc",
      label: "ATC Checks",
      Icon: ScanSearch,
      count: object.atc_checks?.length || 0,
    });
  }

  /*
   * Function Group parent does NOT have AI review.
   * Components DO have AI review.
   */

  if (!isFunctionGroupParent) {
    tabs.push({
      id: "ai",
      label: "AI Code Review",
      Icon: Bot,
      count: aiFindings.length,
    });
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section
      className="
        flex
        h-full
        min-h-0
        min-w-0
        flex-col
        overflow-hidden

        rounded-xl
        border
        border-slate-200
        bg-white

        shadow-sm
        shadow-slate-200/30
      "
    >
      {/* ======================================================
          OBJECT / COMPONENT HEADER
      ====================================================== */}

      <div
        className="
          flex
          min-h-[72px]
          shrink-0
          flex-wrap
          items-center
          justify-between
          gap-3

          border-b
          border-slate-200

          px-5
          py-3
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* ICON */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-slate-100
              text-[#12233f]
            "
          >
            {isComponent ? <FileCode2 size={17} /> : <Box size={17} />}
          </div>

          {/* OBJECT INFORMATION */}

          <div className="min-w-0">
            {isComponent && (
              <div
                className="
                  mb-1
                  flex
                  items-center
                  gap-1.5
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.13em]
                  text-slate-400
                "
              >
                {object.object_name}
                <span>/</span>
                Component
              </div>
            )}

            <h2
              className="
                truncate
                font-mono
                text-[15px]
                font-bold
                text-[#12233f]
              "
            >
              {displayName}
            </h2>

            <div
              className="
                mt-1
                flex
                min-w-0
                flex-wrap
                items-center
                gap-2
                text-[11px]
                text-slate-500
              "
            >
              <span>{getObjectTypeLabel(displayType)}</span>

              {!isComponent && object.object_description && (
                <>
                  <span className="text-slate-300">•</span>

                  <span className="max-w-xl truncate">
                    {object.object_description}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* AI ASSESSMENT */}

        {!isFunctionGroupParent && assessment && (
          <AssessmentBadge status={assessment.status} />
        )}
      </div>

      {/* ======================================================
          TABS
      ====================================================== */}

      <div className="shrink-0 border-b border-slate-200 bg-white px-5">
        <nav className="flex gap-1">
          {tabs.map(({ id, label, Icon, count }) => {
            const isActive = activeTab === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`
                  relative
                  flex
                  h-11
                  items-center
                  gap-2
                  px-3
                  text-xs
                  font-semibold
                  transition

                  ${
                    isActive
                      ? "text-[#b11f2e]"
                      : "text-slate-500 hover:text-slate-800"
                  }
                `}
              >
                <Icon size={14} />

                {label}

                {typeof count === "number" && (
                  <span
                    className={`
                      rounded-md
                      px-1.5
                      py-0.5
                      text-[9px]

                      ${
                        isActive
                          ? "bg-red-50 text-[#b11f2e]"
                          : "bg-slate-100 text-slate-500"
                      }
                    `}
                  >
                    {count}
                  </span>
                )}

                {isActive && (
                  <span
                    className="
                      absolute
                      inset-x-2
                      bottom-0
                      h-[2px]
                      bg-[#b11f2e]
                    "
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ======================================================
          TAB CONTENT
      ====================================================== */}

      <div
        className="
          min-h-0
          flex-1
          overflow-hidden
          bg-[#f8fafc]
          p-3
          lg:p-4
        "
      >
        {/* ====================================================
            SOURCE CODE
        ==================================================== */}

        {activeTab === "source" && (
          <div className="h-full min-h-0">
            <SourceCodeViewer code={sourceCode} title={displayName} />
          </div>
        )}

        {/* ====================================================
            ATC CHECKS
        ==================================================== */}

        {activeTab === "atc" && !isComponent && (
          <div
            className="
              spice-scrollbar
              h-full
              min-h-0
              overflow-y-auto
              pr-1
            "
          >
            <ATCResults findings={object.atc_checks || []} />
          </div>
        )}

        {/* ====================================================
            AI CODE REVIEW
        ==================================================== */}

        {activeTab === "ai" && !isFunctionGroupParent && (
          <div
            className="
              spice-scrollbar
              h-full
              min-h-0
              overflow-y-auto
              pr-1
            "
          >
            <AIReview findings={aiFindings} assessment={assessment} />
          </div>
        )}
      </div>
    </section>
  );
}
