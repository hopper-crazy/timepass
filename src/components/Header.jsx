import { ShieldCheck, Sparkles, Wifi, WifiOff } from "lucide-react";

export default function Header({
  connected = false,
  checkingConnection = false,
}) {
  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        bg-white
        border-b
        border-slate-200
      "
    >
      {/* McCormick red accent */}
      <div className="h-[3px] w-full bg-[#bd1e2d]" />

      <div
        className="
          mx-auto
          flex
          h-[72px]
          w-full
          max-w-[1920px]
          items-center
          justify-between
          px-5
          lg:px-7
        "
      >
        {/* =====================================================
            LEFT — SPICE
        ===================================================== */}

        <div className="flex min-w-0 items-center gap-4">
          {/* APP ICON */}

          <div
            className="
              relative
              flex
              h-[44px]
              w-[44px]
              shrink-0
              items-center
              justify-center
              rounded-[11px]
              bg-[#bd1e2d]
              shadow-[0_5px_15px_rgba(189,30,45,0.16)]
            "
          >
            <ShieldCheck size={22} strokeWidth={2} className="text-white" />

            {/* AI indicator */}

            <span
              className="
                absolute
                -right-[5px]
                -top-[5px]
                flex
                h-[16px]
                w-[16px]
                items-center
                justify-center
                rounded-full
                border-2
                border-white
                bg-[#10213a]
              "
            >
              <Sparkles size={7} strokeWidth={2.5} className="text-white" />
            </span>
          </div>

          {/* PRODUCT NAME */}

          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1
                className="
                  text-[20px]
                  font-extrabold
                  tracking-[-0.035em]
                  text-[#10213a]
                "
              >
                SPICE
              </h1>

              <div className="h-[17px] w-px bg-slate-200" />

              <span
                className="
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.18em]
                  text-[#bd1e2d]
                "
              >
                S/4HANA
              </span>
            </div>

            <p
              className="
                mt-[2px]
                truncate
                text-[10px]
                font-medium
                text-slate-400
              "
            >
              SAP Program Inspection and Code Evaluation
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT
        ===================================================== */}

        <div className="flex shrink-0 items-center">
          {/* ===================================================
              MCCORMICK BRAND
          =================================================== */}

          <div
            className="
              hidden
              items-center
              md:flex
            "
          >
            <div
              className="
                flex
                h-[40px]
                items-center
                border-r
                border-slate-200
                pr-6
              "
            >
              <img
                src="logo512.png"
                alt="McCormick"
                className="
                  h-[30px]
                  w-auto
                  max-w-[95px]
                  object-contain
                "
              />
            </div>
          </div>

          {/* ===================================================
              CONNECTION STATUS
          =================================================== */}

          <div
            className="
              ml-5
              flex
              items-center
              gap-3
            "
          >
            {/* ICON */}

            <div
              className={`
                flex
                h-[38px]
                w-[38px]
                shrink-0
                items-center
                justify-center
                rounded-[10px]

                ${
                  checkingConnection
                    ? "bg-slate-100 text-slate-400"
                    : connected
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                }
              `}
            >
              {checkingConnection ? (
                <div
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-slate-300
                    border-t-slate-600
                  "
                />
              ) : connected ? (
                <Wifi size={17} strokeWidth={2} />
              ) : (
                <WifiOff size={17} strokeWidth={2} />
              )}
            </div>

            {/* STATUS */}

            <div className="hidden sm:block">
              <div
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.17em]
                  text-slate-400
                "
              >
                SAP System
              </div>

              <div
                className="
                  mt-[3px]
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className={`
                    text-[10px]
                    font-bold

                    ${
                      checkingConnection
                        ? "text-slate-500"
                        : connected
                          ? "text-emerald-600"
                          : "text-red-600"
                    }
                  `}
                >
                  {checkingConnection
                    ? "Checking..."
                    : connected
                      ? "Connected"
                      : "Disconnected"}
                </span>

                {!checkingConnection && (
                  <span
                    className={`
                      h-[6px]
                      w-[6px]
                      rounded-full

                      ${connected ? "bg-emerald-500" : "bg-red-500"}
                    `}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
