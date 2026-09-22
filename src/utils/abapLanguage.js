let registered = false;

export const registerABAPLanguage = (monaco) => {
  if (registered) return;

  monaco.languages.register({
    id: "abap",
  });

  monaco.languages.setMonarchTokensProvider("abap", {
    ignoreCase: true,

    keywords: [
      "REPORT",
      "PROGRAM",
      "CLASS",
      "DEFINITION",
      "IMPLEMENTATION",
      "ENDCLASS",
      "METHODS",
      "METHOD",
      "ENDMETHOD",
      "INTERFACE",
      "ENDINTERFACE",

      "FUNCTION",
      "ENDFUNCTION",
      "FUNCTION-POOL",

      "DATA",
      "TYPES",
      "TYPE",
      "LIKE",
      "CONSTANTS",
      "FIELD-SYMBOLS",

      "SELECT",
      "SINGLE",
      "FROM",
      "INTO",
      "TABLE",
      "CORRESPONDING",
      "FIELDS",
      "OF",
      "WHERE",
      "GROUP",
      "BY",
      "ORDER",
      "HAVING",
      "INNER",
      "LEFT",
      "RIGHT",
      "OUTER",
      "JOIN",
      "ON",
      "UP",
      "TO",
      "ROWS",

      "INSERT",
      "UPDATE",
      "MODIFY",
      "DELETE",

      "LOOP",
      "ENDLOOP",
      "DO",
      "ENDDO",
      "WHILE",
      "ENDWHILE",

      "IF",
      "ELSE",
      "ELSEIF",
      "ENDIF",
      "CASE",
      "WHEN",
      "ENDCASE",

      "READ",
      "ASSIGN",
      "UNASSIGN",

      "CALL",
      "FUNCTION",
      "METHOD",

      "TRY",
      "CATCH",
      "CLEANUP",
      "ENDTRY",
      "RAISE",

      "RETURN",
      "CHECK",
      "CONTINUE",
      "EXIT",

      "APPEND",
      "COLLECT",
      "CLEAR",
      "FREE",
      "REFRESH",

      "IMPORTING",
      "EXPORTING",
      "CHANGING",
      "RETURNING",
      "RECEIVING",
      "EXCEPTIONS",

      "PUBLIC",
      "PROTECTED",
      "PRIVATE",
      "SECTION",

      "CREATE",
      "OBJECT",
      "REFERENCE",
      "NEW",
      "VALUE",
      "CORRESPONDING",
      "CONV",
      "CAST",
      "REF",

      "AUTHORITY-CHECK",

      "COMMIT",
      "ROLLBACK",
      "WORK",

      "MESSAGE",
      "IN",
      "AND",
      "OR",
      "NOT",
      "IS",
      "INITIAL",
      "BOUND",
      "ASSIGNED",

      "WITH",
      "KEY",
      "INDEX",
      "TRANSPORTING",
      "NO",
      "FIELDS",

      "ABAP_TRUE",
      "ABAP_FALSE",
    ],

    typeKeywords: [
      "STRING",
      "I",
      "INT8",
      "D",
      "T",
      "C",
      "N",
      "X",
      "XSTRING",
      "DECFLOAT16",
      "DECFLOAT34",
      "P",
      "F",
      "CHAR",
      "NUMC",
      "DATS",
      "TIMS",
    ],

    tokenizer: {
      root: [
        [/^\s*\*.*/, "comment"],
        [/".*$/, "comment"],

        [/'([^']|'')*'/, "string"],
        [/`[^`]*`/, "string"],

        [/\b\d+(\.\d+)?\b/, "number"],

        [
          /[a-zA-Z_\/][\w\-\/]*/,
          {
            cases: {
              "@keywords": "keyword",
              "@typeKeywords": "type",
              "@default": "identifier",
            },
          },
        ],

        [/[=<>~:+\-*/]+/, "operator"],
        [/[{}()[\]]/, "@brackets"],
        [/[;,.]/, "delimiter"],
      ],
    },
  });

  monaco.editor.defineTheme("spice-abap-dark", {
    base: "vs-dark",
    inherit: true,

    rules: [
      {
        token: "keyword",
        foreground: "7DD3FC",
        fontStyle: "bold",
      },
      {
        token: "type",
        foreground: "C4B5FD",
      },
      {
        token: "string",
        foreground: "A7F3D0",
      },
      {
        token: "comment",
        foreground: "7C8AA0",
        fontStyle: "italic",
      },
      {
        token: "number",
        foreground: "FBBF24",
      },
      {
        token: "operator",
        foreground: "F8FAFC",
      },
      {
        token: "identifier",
        foreground: "E2E8F0",
      },
    ],

    colors: {
      "editor.background": "#0D1524",
      "editor.foreground": "#E2E8F0",
      "editorLineNumber.foreground": "#526077",
      "editorLineNumber.activeForeground": "#CBD5E1",
      "editor.selectionBackground": "#28415F",
      "editor.inactiveSelectionBackground": "#1D3149",
      "editorCursor.foreground": "#E2E8F0",
      "editor.lineHighlightBackground": "#111E31",
      "editorWidget.background": "#152238",
      "editorWidget.border": "#334155",
      "editor.findMatchBackground": "#854D0E",
      "editor.findMatchHighlightBackground": "#713F1244",
      "scrollbarSlider.background": "#64748B55",
      "scrollbarSlider.hoverBackground": "#94A3B877",
      "scrollbarSlider.activeBackground": "#CBD5E199",
    },
  });

  registered = true;
};