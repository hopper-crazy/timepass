import { useRef, useState } from "react";

import Editor from "@monaco-editor/react";

import { Check, Code2, Copy, Search } from "lucide-react";

import EmptyState from "./EmptyState";

import { registerABAPLanguage } from "../utils/abapLanguage";

export default function SourceCodeViewer({ code, title = "ABAP Source" }) {
  const editorRef = useRef(null);

  const [copied, setCopied] = useState(false);

  // ============================================================
  // EDITOR MOUNT
  // ============================================================

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    requestAnimationFrame(() => {
      editor.layout();
    });
  };

  // ============================================================
  // FIND
  // ============================================================

  const handleFind = () => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    editor.focus();

    editor.getAction("actions.find")?.run();
  };

  // ============================================================
  // COPY COMPLETE SOURCE
  // ============================================================

  const handleCopy = async () => {
    if (!code) {
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");

        textArea.value = code;

        textArea.setAttribute("readonly", "");

        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";

        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        textArea.setSelectionRange(0, textArea.value.length);

        document.execCommand("copy");

        document.body.removeChild(textArea);
      }

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch (error) {
      console.error("Unable to copy source code:", error);
    }
  };

  // ============================================================
  // EMPTY SOURCE
  // ============================================================

  if (!code) {
    return (
      <EmptyState
        icon={Code2}
        title="Source code unavailable"
        description="No source code was returned for this SAP object."
      />
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="
        flex
        h-full
        min-h-0
        flex-col
        overflow-hidden

        rounded-xl
        border
        border-slate-700

        bg-[#0D1524]

        shadow-sm
      "
    >
      {/* ======================================================
          TOOLBAR
      ====================================================== */}

      <div
        className="
          relative
          z-20
          flex
          h-11
          shrink-0
          items-center
          justify-between

          border-b
          border-slate-700/80

          bg-[#111c2d]

          px-4
        "
      >
        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-3">
          <Code2 size={15} className="shrink-0 text-slate-400" />

          <span
            className="
              truncate
              font-mono
              text-[11px]
              font-semibold
              text-slate-300
            "
          >
            {title}
          </span>

          <span
            className="
              hidden
              rounded
              border
              border-slate-600
              px-1.5
              py-0.5
              text-[8px]
              font-bold
              uppercase
              tracking-wider
              text-slate-500

              sm:inline
            "
          >
            Read Only
          </span>

          <span
            className="
              hidden
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-slate-600

              lg:inline
            "
          >
            ABAP
          </span>
        </div>

        {/* RIGHT */}

        <div className="flex shrink-0 items-center gap-1">
          {/* FIND */}

          <button
            type="button"
            onClick={handleFind}
            title="Find in source (Ctrl+F)"
            aria-label="Find in source"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              text-slate-400
              transition

              hover:bg-white/10
              hover:text-white

              focus:outline-none
              focus:ring-2
              focus:ring-slate-500/60
            "
          >
            <Search size={15} />
          </button>

          {/* COPY */}

          <button
            type="button"
            onClick={handleCopy}
            title={copied ? "Source copied" : "Copy complete source"}
            aria-label="Copy complete source"
            className={`
              flex
              h-8
              items-center
              justify-center
              gap-1.5
              rounded-md
              px-2.5
              text-[10px]
              font-medium
              transition

              focus:outline-none
              focus:ring-2
              focus:ring-slate-500/60

              ${
                copied
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            {copied ? (
              <>
                <Check size={14} />

                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />

                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ======================================================
          MONACO
      ====================================================== */}

      <div
        className="
          relative
          min-h-0
          min-w-0
          flex-1
        "
      >
        <Editor
          height="100%"
          width="100%"
          language="abap"
          value={code}
          theme="spice-abap-dark"
          beforeMount={(monaco) => {
            registerABAPLanguage(monaco);
          }}
          onMount={handleEditorDidMount}
          options={{
            // ================================================
            // READ ONLY
            // ================================================

            readOnly: true,

            /*
             * Do NOT use domReadOnly:true.
             *
             * Monaco still needs keyboard focus for:
             * Ctrl+F
             * Ctrl+C
             * text selection
             */

            domReadOnly: false,

            // ================================================
            // DISABLE STICKY TOP LINES
            // ================================================

            stickyScroll: {
              enabled: false,
            },

            // ================================================
            // SELECTION
            // ================================================

            contextmenu: true,

            selectOnLineNumbers: true,

            selectionHighlight: true,

            roundedSelection: true,

            occurrencesHighlight: "singleFile",

            // ================================================
            // LINE NUMBERS
            // ================================================

            lineNumbers: "on",

            lineNumbersMinChars: 4,

            glyphMargin: false,

            // ================================================
            // FOLDING
            // ================================================

            folding: true,

            foldingHighlight: true,

            showFoldingControls: "mouseover",

            // ================================================
            // MINIMAP
            // ================================================

            minimap: {
              enabled: true,

              renderCharacters: false,

              maxColumn: 100,

              scale: 1,

              showSlider: "mouseover",
            },

            // ================================================
            // FONT
            // ================================================

            fontSize: 13,

            lineHeight: 21,

            fontFamily:
              "'Cascadia Code', 'JetBrains Mono', Consolas, 'Courier New', monospace",

            fontLigatures: true,

            // ================================================
            // LAYOUT
            // ================================================

            automaticLayout: true,

            padding: {
              top: 14,
              bottom: 14,
            },

            // ================================================
            // CODE LAYOUT
            // ================================================

            wordWrap: "off",

            wrappingIndent: "none",

            // ================================================
            // SCROLLING
            // ================================================

            scrollBeyondLastLine: false,

            scrollBeyondLastColumn: 5,

            smoothScrolling: true,

            mouseWheelScrollSensitivity: 1,

            fastScrollSensitivity: 5,

            scrollbar: {
              vertical: "visible",

              horizontal: "visible",

              verticalScrollbarSize: 11,

              horizontalScrollbarSize: 11,

              verticalSliderSize: 8,

              horizontalSliderSize: 8,

              useShadows: false,

              handleMouseWheel: true,

              alwaysConsumeMouseWheel: false,
            },

            // ================================================
            // FIND
            // ================================================

            find: {
              addExtraSpaceOnTop: true,

              autoFindInSelection: "never",

              seedSearchStringFromSelection: "selection",
            },

            // ================================================
            // CURRENT LINE
            // ================================================

            renderLineHighlight: "line",

            cursorBlinking: "solid",

            cursorStyle: "line",

            // ================================================
            // OVERVIEW
            // ================================================

            overviewRulerBorder: false,

            hideCursorInOverviewRuler: true,

            // ================================================
            // WHITESPACE
            // ================================================

            renderWhitespace: "selection",

            // ================================================
            // DISABLE EDITING FEATURES
            // ================================================

            quickSuggestions: false,

            suggestOnTriggerCharacters: false,

            acceptSuggestionOnEnter: "off",

            codeLens: false,

            links: false,

            parameterHints: {
              enabled: false,
            },

            // ================================================
            // HOVER
            // ================================================

            hover: {
              enabled: true,
              delay: 300,
              sticky: true,
            },

            accessibilitySupport: "auto",
          }}
        />
      </div>

      {/* ======================================================
          STATUS BAR
      ====================================================== */}

      <div
        className="
          flex
          h-7
          shrink-0
          items-center
          justify-between

          border-t
          border-slate-700/70

          bg-[#111c2d]

          px-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            text-[9px]
            font-medium
            text-slate-500
          "
        >
          <span>ABAP</span>

          <span className="h-3 w-px bg-slate-700" />

          <span>{code.split("\n").length} lines</span>
        </div>

        <div
          className="
            hidden
            items-center
            gap-3
            text-[9px]
            text-slate-600

            sm:flex
          "
        >
          <span>Ctrl+F Find</span>

          <span>Ctrl+C Copy selection</span>
        </div>
      </div>
    </div>
  );
}
