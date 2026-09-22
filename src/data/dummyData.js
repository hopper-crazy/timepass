export const dummyTransportData = {
  transport_request: "DEVK900123",

  total_objects: 4,
  total_atc_findings: 5,
  total_ai_findings: 5,

  objects: [
    {
      object_name: "ZCL_R2R_POSTING_SERVICE",
      object_type: "CLAS",
      object_description:
        "R2R posting service and document processing.",

      components: [],

      source_code: `CLASS zcl_r2r_posting_service DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    METHODS:
      post_document
        IMPORTING
          iv_bukrs TYPE bukrs
        RETURNING
          VALUE(rv_success) TYPE abap_bool.

  PRIVATE SECTION.
    METHODS validate_document.
ENDCLASS.

CLASS zcl_r2r_posting_service IMPLEMENTATION.

  METHOD post_document.

    DATA lv_company_code TYPE bukrs.

    lv_company_code = iv_bukrs.

    IF lv_company_code IS INITIAL.
      rv_success = abap_false.
      RETURN.
    ENDIF.

    SELECT SINGLE bukrs
      FROM t001
      INTO @DATA(lv_bukrs)
      WHERE bukrs = @lv_company_code.

    IF sy-subrc = 0.
      rv_success = abap_true.
    ELSE.
      rv_success = abap_false.
    ENDIF.

  ENDMETHOD.

  METHOD validate_document.

    DATA lv_valid TYPE abap_bool.

    lv_valid = abap_true.

  ENDMETHOD.

ENDCLASS.`,

      atc_checks: [
        {
          message:
            "Database access can be optimized.",
          source: "ZCL_R2R_POSTING_SERVICE",
          severity: "WARNING",
          lineno: 30,
          recommendation:
            "Review whether repeated company-code validation can be buffered or consolidated.",
        },
        {
          message:
            "Local variable is assigned but not subsequently used.",
          source: "ZCL_R2R_POSTING_SERVICE",
          severity: "LOW",
          lineno: 46,
          recommendation:
            "Remove unused declarations where they are not required.",
        },
      ],

      ai_code_review: [
        {
          category: "Maintainability",
          severity: "WARNING",
          findings:
            "Validation responsibilities can be separated more clearly.",
          comment:
            "The class currently combines validation and posting responsibilities.",
          recommendation:
            "Consider extracting reusable validation logic into a dedicated method or service.",
          code_reference:
            "METHOD validate_document.",
        },
        {
          category: "Modern ABAP",
          severity: "LOW",
          findings:
            "The implementation can make greater use of expression-oriented ABAP.",
          comment:
            "Modern syntax can reduce procedural boilerplate in selected sections.",
          recommendation:
            "Use modern expressions where they improve clarity without reducing maintainability.",
          code_reference:
            "IF sy-subrc = 0.",
        },
      ],

      ai_overall_assessment: {
        status: "WARNING",
        summary:
          "The implementation is generally maintainable, but minor database-access and design improvements are recommended before release.",
      },
    },

    {
      object_name: "ZFG_R2R_SAMPLE",
      object_type: "FUGR",
      object_description:
        "R2R shared function group for posting and validation utilities.",

      source_code: `FUNCTION-POOL zfg_r2r_sample.

DATA:
  gv_company_code TYPE bukrs,
  gv_document     TYPE belnr_d.

CONSTANTS:
  gc_active TYPE abap_bool VALUE abap_true.`,

      atc_checks: [
        {
          message:
            "Global data declared in Function Group.",
          source: "ZFG_R2R_SAMPLE",
          severity: "WARNING",
          lineno: 3,
          recommendation:
            "Review whether global state is required and minimize its scope where possible.",
        },
        {
          message:
            "Function Group contains legacy procedural components.",
          source: "ZFG_R2R_SAMPLE",
          severity: "INFO",
          lineno: 1,
          recommendation:
            "Evaluate class-based alternatives for future development where appropriate.",
        },
      ],

      // Intentionally ignored by UI for FUGR parent.
      ai_code_review: [],

      ai_overall_assessment: {
        status: "PASS",
        summary: "",
      },

      components: [
        {
          component_name:
            "LZFG_R2R_SAMPLETOP",
          component_type: "INCL",
          source_status: "AVAILABLE",

          source_code: `FUNCTION-POOL zfg_r2r_sample.

DATA:
  gv_company_code TYPE bukrs,
  gv_document     TYPE belnr_d.

CONSTANTS:
  gc_active TYPE abap_bool VALUE abap_true.`,

          ai_code_review: [
            {
              category: "Clean Core",
              severity: "WARNING",
              findings:
                "Global state increases coupling between Function Group components.",
              comment:
                "Shared global variables can make behavior harder to reason about and test.",
              recommendation:
                "Reduce shared mutable state where practical.",
              code_reference:
                "DATA: gv_company_code TYPE bukrs",
            },
          ],

          ai_overall_assessment: {
            status: "WARNING",
            summary:
              "The TOP include is functional but shared global state should be reviewed.",
          },
        },

        {
          component_name:
            "LZFG_R2R_SAMPLEU01",
          component_type: "INCL",
          source_status: "AVAILABLE",

          source_code: `FUNCTION z_r2r_validate_document.

  IF iv_bukrs IS INITIAL.
    ev_valid = abap_false.
    RETURN.
  ENDIF.

  SELECT SINGLE bukrs
    FROM t001
    INTO @DATA(lv_bukrs)
    WHERE bukrs = @iv_bukrs.

  IF sy-subrc = 0.
    ev_valid = abap_true.
  ELSE.
    ev_valid = abap_false.
  ENDIF.

ENDFUNCTION.`,

          ai_code_review: [
            {
              category: "Database Access",
              severity: "LOW",
              findings:
                "Company-code existence is checked directly against T001.",
              comment:
                "The implementation is straightforward but may be repeatedly executed.",
              recommendation:
                "Consider whether existing validation APIs or buffered access can be reused.",
              code_reference:
                "SELECT SINGLE bukrs FROM t001",
            },
          ],

          ai_overall_assessment: {
            status: "PASS",
            summary:
              "No significant issue was identified. Minor optimization may be considered.",
          },
        },

        {
          component_name:
            "LZFG_R2R_SAMPLEF01",
          component_type: "INCL",
          source_status: "AVAILABLE",

          source_code: `FORM prepare_document.

  DATA lv_timestamp TYPE timestampl.

  GET TIME STAMP FIELD lv_timestamp.

  IF gv_company_code IS INITIAL.
    RETURN.
  ENDIF.

ENDFORM.`,

          ai_code_review: [
            {
              category: "Modern ABAP",
              severity: "WARNING",
              findings:
                "FORM routines represent legacy procedural ABAP.",
              comment:
                "Subroutines make encapsulation and unit testing more difficult than class-based implementations.",
              recommendation:
                "For future refactoring, consider moving reusable business logic into an ABAP class.",
              code_reference:
                "FORM prepare_document.",
            },
          ],

          ai_overall_assessment: {
            status: "WARNING",
            summary:
              "The implementation works but should be considered for class-based modernization.",
          },
        },
      ],
    },

    {
      object_name: "ZR2R_RECON_REPORT",
      object_type: "PROG",
      object_description:
        "R2R reconciliation and exception report.",

      components: [],

      source_code: `REPORT zr2r_recon_report.

PARAMETERS:
  p_bukrs TYPE bukrs OBLIGATORY.

START-OF-SELECTION.

  SELECT bukrs,
         belnr,
         gjahr
    FROM bkpf
    INTO TABLE @DATA(lt_documents)
    WHERE bukrs = @p_bukrs.

  LOOP AT lt_documents
    INTO DATA(ls_document).

    WRITE:
      / ls_document-bukrs,
        ls_document-belnr,
        ls_document-gjahr.

  ENDLOOP.`,

      atc_checks: [
        {
          message:
            "Classic list output detected.",
          source: "ZR2R_RECON_REPORT",
          severity: "INFO",
          lineno: 17,
          recommendation:
            "Consider a modern Fiori-based presentation for future modernization.",
        },
      ],

      ai_code_review: [
        {
          category: "Modernization",
          severity: "WARNING",
          findings:
            "The report uses classic WRITE output.",
          comment:
            "Classic list processing provides limited usability compared with modern SAP UX approaches.",
          recommendation:
            "Evaluate a Fiori/RAP-based reporting experience if modernization is in scope.",
          code_reference:
            "WRITE: / ls_document-bukrs",
        },
      ],

      ai_overall_assessment: {
        status: "WARNING",
        summary:
          "The report is functional but contains opportunities for UI modernization.",
      },
    },

    {
      object_name: "ZR2R_I_JOURNALENTRY",
      object_type: "DDLS",
      object_description:
        "CDS data definition for journal-entry analysis.",

      components: [],

      source_code: `@EndUserText.label: 'R2R Journal Entry'
@AccessControl.authorizationCheck: #CHECK
define view entity ZR2R_I_JournalEntry
  as select from I_JournalEntry
{
  key CompanyCode,
  key FiscalYear,
  key AccountingDocument,

      AccountingDocumentType,
      DocumentDate,
      PostingDate,
      TransactionCurrency
}`,

      atc_checks: [],

      ai_code_review: [
        {
          category: "Clean Core",
          severity: "LOW",
          findings:
            "The CDS entity consumes a released interface view.",
          comment:
            "The design follows a clean-core-friendly extension approach.",
          recommendation:
            "Continue validating released API/view status during upgrades.",
          code_reference:
            "as select from I_JournalEntry",
        },
      ],

      ai_overall_assessment: {
        status: "PASS",
        summary:
          "The CDS design is concise and aligned with modern S/4HANA development practices.",
      },
    },
  ],
};