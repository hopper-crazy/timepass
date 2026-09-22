import { useState } from "react";

import {
  Box,
  Braces,
  ChevronDown,
  ChevronRight,
  FileCode2,
  FunctionSquare,
  Search,
} from "lucide-react";

import { getObjectTypeLabel } from "../utils/objectTypes";

export default function ObjectNavigator({
  objects = [],
  selection,
  onSelectObject,
  onSelectComponent,
}) {
  const [expanded, setExpanded] = useState({});

  const [search, setSearch] = useState("");

  // ============================================================
  // FUNCTION GROUP EXPAND / COLLAPSE
  // ============================================================

  const toggleExpanded = (objectName, event) => {
    event.stopPropagation();

    setExpanded((current) => ({
      ...current,
      [objectName]: !current[objectName],
    }));
  };

  // ============================================================
  // FILTER
  // ============================================================

  const filteredObjects = objects.filter((object) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    const objectName = object.object_name?.toLowerCase() || "";

    const objectType = object.object_type?.toLowerCase() || "";

    const typeLabel =
      getObjectTypeLabel(object.object_type)?.toLowerCase() || "";

    const objectMatch =
      objectName.includes(query) ||
      objectType.includes(query) ||
      typeLabel.includes(query);

    const componentMatch =
      object.object_type === "FUGR" &&
      (object.components || []).some((component) => {
        const name = component.component_name?.toLowerCase() || "";

        const type = component.component_type?.toLowerCase() || "";

        return name.includes(query) || type.includes(query);
      });

    return objectMatch || componentMatch;
  });

  // ============================================================
  // AI STATUS ACCENT
  // ============================================================

  const getAccentColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PASS":
        return "bg-emerald-500";

      case "WARNING":
        return "bg-amber-500";

      case "FAIL":
        return "bg-red-500";

      default:
        return "bg-slate-400";
    }
  };

  // ============================================================
  // FUNCTION GROUP STATUS
  //
  // Parent FUGR has no AI review.
  // Therefore use ATC severity.
  // ============================================================

  const getFunctionGroupAccent = (object) => {
    const findings = object.atc_checks || [];

    const hasError = findings.some((item) => {
      const severity = item.severity?.toUpperCase();

      return severity === "ERROR" || severity === "CRITICAL";
    });

    if (hasError) {
      return "bg-red-500";
    }

    const hasWarning = findings.some(
      (item) => item.severity?.toUpperCase() === "WARNING",
    );

    if (hasWarning) {
      return "bg-amber-500";
    }

    return "bg-emerald-500";
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <aside
      className="
        flex
        h-full
        min-h-0
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
          NAVIGATOR HEADER
      ====================================================== */}

      <div className="shrink-0 border-b border-slate-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#12233f]">
              Transport Objects
            </h2>

            <p className="mt-0.5 text-[11px] text-slate-400">
              {objects.length} objects
            </p>
          </div>

          <span
            className="
              flex
              h-8
              min-w-8
              items-center
              justify-center
              rounded-lg
              bg-slate-100
              px-2
              text-xs
              font-bold
              text-slate-600
            "
          >
            {objects.length}
          </span>
        </div>

        {/* SEARCH */}

        <div className="relative mt-3">
          <Search
            size={14}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter objects..."
            className="
              h-10
              w-full
              rounded-lg
              border
              border-slate-200
              bg-slate-50
              pl-9
              pr-3
              text-xs
              text-slate-700
              outline-none
              transition

              placeholder:text-slate-400

              focus:border-slate-300
              focus:bg-white
              focus:ring-2
              focus:ring-slate-100
            "
          />
        </div>
      </div>

      {/* ======================================================
          SCROLLABLE OBJECT LIST
      ====================================================== */}

      <div
        className="
          spice-scrollbar
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          p-2
        "
      >
        {filteredObjects.map((object) => {
          const isFunctionGroup = object.object_type === "FUGR";

          const isExpanded = !!expanded[object.object_name];

          const objectSelected =
            selection?.type === "object" &&
            selection?.object?.object_name === object.object_name;

          const accentColor = isFunctionGroup
            ? getFunctionGroupAccent(object)
            : getAccentColor(object.ai_overall_assessment?.status);

          return (
            <div key={object.object_name} className="mb-1">
              {/* ============================================
                    MAIN OBJECT
                ============================================ */}

              <div
                className={`
                    group
                    relative
                    flex
                    w-full
                    items-center
                    rounded-lg
                    transition-all
                    duration-150

                    ${
                      objectSelected
                        ? "bg-slate-100 shadow-sm"
                        : "hover:bg-slate-50"
                    }
                  `}
              >
                {/* SELECTED STATUS ACCENT */}

                {objectSelected && (
                  <span
                    className={`
                        absolute
                        bottom-2
                        left-0
                        top-2
                        w-[3px]
                        rounded-r-full
                        ${accentColor}
                      `}
                  />
                )}

                {/* FUNCTION GROUP EXPAND BUTTON */}

                {isFunctionGroup ? (
                  <button
                    type="button"
                    title={
                      isExpanded ? "Collapse components" : "Expand components"
                    }
                    onClick={(event) =>
                      toggleExpanded(object.object_name, event)
                    }
                    className="
                        ml-2
                        flex
                        h-8
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        text-slate-400
                        transition

                        hover:bg-white
                        hover:text-[#12233f]
                      "
                  >
                    {isExpanded ? (
                      <ChevronDown size={15} />
                    ) : (
                      <ChevronRight size={15} />
                    )}
                  </button>
                ) : (
                  <span
                    className="
                        ml-2
                        flex
                        h-8
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        text-slate-400
                      "
                  >
                    <ObjectIcon type={object.object_type} />
                  </span>
                )}

                {/* OBJECT */}

                <button
                  type="button"
                  onClick={() => onSelectObject(object)}
                  className="
                      min-w-0
                      flex-1
                      py-3
                      pr-3
                      text-left
                    "
                >
                  <div
                    className={`
                        truncate
                        font-mono
                        text-[12px]
                        font-semibold

                        ${
                          objectSelected
                            ? "text-[#12233f]"
                            : "text-slate-700 group-hover:text-[#12233f]"
                        }
                      `}
                  >
                    {object.object_name}
                  </div>

                  <div className="mt-1 truncate text-[10px] font-medium text-slate-400">
                    {getObjectTypeLabel(object.object_type)}
                  </div>
                </button>
              </div>

              {/* ============================================
                    FUNCTION GROUP COMPONENTS
                ============================================ */}

              {isFunctionGroup && isExpanded && (
                <div
                  className="
                        relative
                        ml-[25px]
                        border-l
                        border-slate-200
                        py-1
                        pl-3
                      "
                >
                  {(object.components || []).map((component) => {
                    const componentSelected =
                      selection?.type === "component" &&
                      selection?.object?.object_name === object.object_name &&
                      selection?.component?.component_name ===
                        component.component_name;

                    const componentAccent = getAccentColor(
                      component.ai_overall_assessment?.status,
                    );

                    return (
                      <button
                        type="button"
                        key={component.component_name}
                        onClick={() => onSelectComponent(object, component)}
                        className={`
                                group/component
                                relative
                                mb-0.5
                                flex
                                w-full
                                items-center
                                gap-2.5
                                rounded-md
                                px-2.5
                                py-2.5
                                text-left
                                transition-all
                                duration-150

                                ${
                                  componentSelected
                                    ? "bg-slate-100 shadow-sm"
                                    : "hover:bg-slate-50"
                                }
                              `}
                      >
                        {/* TREE CONNECTOR */}

                        <span
                          className="
                                  absolute
                                  -left-[13px]
                                  top-1/2
                                  h-px
                                  w-3
                                  bg-slate-200
                                "
                        />

                        {/* COMPONENT ACCENT */}

                        {componentSelected && (
                          <span
                            className={`
                                    absolute
                                    bottom-1.5
                                    left-0
                                    top-1.5
                                    w-[3px]
                                    rounded-r-full
                                    ${componentAccent}
                                  `}
                          />
                        )}

                        <FileCode2
                          size={13}
                          className={
                            componentSelected
                              ? "shrink-0 text-[#12233f]"
                              : "shrink-0 text-slate-400"
                          }
                        />

                        <div className="min-w-0 flex-1">
                          <div
                            className={`
                                    truncate
                                    font-mono
                                    text-[11px]
                                    font-semibold

                                    ${
                                      componentSelected
                                        ? "text-[#12233f]"
                                        : "text-slate-600 group-hover/component:text-slate-800"
                                    }
                                  `}
                          >
                            {component.component_name}
                          </div>

                          <div className="mt-0.5 truncate text-[9px] font-medium text-slate-400">
                            {getObjectTypeLabel(component.component_type)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* ====================================================
            EMPTY SEARCH
        ==================================================== */}

        {filteredObjects.length === 0 && (
          <div className="flex h-40 items-center justify-center px-6 text-center">
            <div>
              <Search size={18} className="mx-auto text-slate-300" />

              <p className="mt-2 text-xs font-medium text-slate-500">
                No objects found
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Try a different object name or type.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

// ============================================================
// OBJECT ICON
// ============================================================

function ObjectIcon({ type }) {
  switch (type) {
    case "CLAS":
      return <Braces size={14} />;

    case "FUNC":
    case "FUGR":
      return <FunctionSquare size={14} />;

    default:
      return <Box size={14} />;
  }
}
