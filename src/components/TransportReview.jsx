import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import TransportSummary from "./TransportSummary";
import ObjectNavigator from "./ObjectNavigator";
import ObjectDetails from "./ObjectDetails";

export default function TransportReview({ data, onNewTransport }) {
  const [selection, setSelection] = useState({
    type: "object",
    object: data?.objects?.[0] || null,
    component: null,
  });

  // ============================================================
  // SELECT MAIN OBJECT
  // ============================================================

  const selectObject = (object) => {
    setSelection({
      type: "object",
      object,
      component: null,
    });
  };

  // ============================================================
  // SELECT FUNCTION GROUP COMPONENT
  // ============================================================

  const selectComponent = (parentObject, component) => {
    setSelection({
      type: "component",
      object: parentObject,
      component,
    });
  };

  return (
    <main className="mx-auto w-full max-w-[1920px] px-4 py-4 lg:px-6">
      {/* ======================================================
          TRANSPORT HEADER
      ====================================================== */}

      <section className="mb-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b11f2e]">
            Transport Analysis
          </div>

          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <h1 className="font-mono text-xl font-bold tracking-tight text-[#12233f]">
              {data?.transport_request}
            </h1>

            <span className="text-xs text-slate-400">
              SAP S/4HANA development review
            </span>
          </div>
        </div>

        {/* NEW TRANSPORT */}

        <button
          type="button"
          onClick={onNewTransport}
          className="
            flex h-9 items-center gap-2
            rounded-lg
            border border-slate-200
            bg-white
            px-3.5
            text-xs
            font-semibold
            text-slate-600
            transition-all
            duration-150

            hover:border-slate-300
            hover:bg-slate-50
            hover:text-[#12233f]

            focus:outline-none
            focus:ring-2
            focus:ring-slate-200
          "
        >
          <ArrowLeft size={14} />
          New Transport
        </button>
      </section>

      {/* ======================================================
          TRANSPORT SUMMARY
      ====================================================== */}

      <TransportSummary data={data} />

      {/* ======================================================
          MAIN REVIEW WORKSPACE

          IMPORTANT:
          This is the single height controller.

          Both the Object Navigator and Object Details
          inherit this exact height using h-full.
      ====================================================== */}

      <div
        className="
          mt-3
          grid
          min-w-0
          gap-4

          xl:h-[calc(100vh-205px)]
          xl:min-h-[620px]
          xl:max-h-[900px]

          xl:grid-cols-[310px_minmax(0,1fr)]
        "
      >
        <ObjectNavigator
          objects={data?.objects || []}
          selection={selection}
          onSelectObject={selectObject}
          onSelectComponent={selectComponent}
        />

        <ObjectDetails selection={selection} />
      </div>
    </main>
  );
}
