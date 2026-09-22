export const dummyTransportData = {
  transport_request: "DS4K901245",

  total_objects: 15,
  total_atc_findings: 16,
  total_ai_findings: 18,

  objects: [
    // ============================================================
    // 1. ABAP PROGRAM
    // ============================================================

    {
      object_name: "ZR2R_RECON_REPORT",
      object_type: "PROG",
      object_description: "R2R reconciliation and exception report.",
      components: [],

      source_code: `REPORT zr2r_recon_report.

PARAMETERS:
  p_bukrs TYPE bukrs OBLIGATORY,
  p_gjahr TYPE gjahr OBLIGATORY.

TYPES:
  BEGIN OF ty_document,
    bukrs TYPE bukrs,
    belnr TYPE belnr_d,
    gjahr TYPE gjahr,
    budat TYPE budat,
    hkont TYPE hkont,
    dmbtr TYPE dmbtr,
  END OF ty_document.

DATA:
  gt_documents TYPE STANDARD TABLE OF ty_document,
  gs_document  TYPE ty_document.

START-OF-SELECTION.

  SELECT bukrs,
         belnr,
         gjahr,
         budat,
         hkont,
         dmbtr
    FROM bseg
    WHERE bukrs = @p_bukrs
      AND gjahr = @p_gjahr
    INTO TABLE @gt_documents.

  IF sy-subrc <> 0.
    MESSAGE 'No accounting documents found' TYPE 'S'.
    RETURN.
  ENDIF.

  LOOP AT gt_documents INTO gs_document.

    WRITE:
      / gs_document-bukrs,
        gs_document-belnr,
        gs_document-gjahr,
        gs_document-dmbtr.

  ENDLOOP.`,

      atc_checks: [
        {
          message: "Database access can be optimized.",
          source: "ABAP Test Cockpit",
          severity: "WARNING",
          lineno: 24,
          recommendation:
            "Review the database selection and retrieve only required records."
        },
        {
          message: "Class-based implementation recommended.",
          source: "Clean ABAP",
          severity: "INFO",
          lineno: 1,
          recommendation:
            "Consider moving business logic into a reusable ABAP class."
        }
      ],

      ai_code_review: [
        {
          category: "Modernization",
          severity: "WARNING",
          findings:
            "Classical WRITE-based output is used.",
          comment:
            "The report uses classical list processing.",
          recommendation:
            "Consider SALV, RAP, or a Fiori-based user experience.",
          code_reference:
            "WRITE: / gs_document-bukrs..."
        },
        {
          category: "Architecture",
          severity: "INFO",
          findings:
            "Business logic is implemented directly in the executable report.",
          comment:
            "This reduces reuse and testability.",
          recommendation:
            "Move data retrieval and processing into dedicated classes.",
          code_reference:
            "START-OF-SELECTION"
        }
      ],

      ai_overall_assessment: {
        status: "WARNING",
        summary:
          "The report is functional but contains opportunities for modernization and improved separation of concerns."
      }
    },

    // ============================================================
    // 2. ABAP CLASS
    // ============================================================

    {
      object_name: "ZCL_R2R_POSTING_SERVICE",
      object_type: "CLAS",
      object_description:
        "R2R posting service and accounting document validation.",
      components: [],

      source_code: `CLASS zcl_r2r_posting_service DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.

    METHODS:
      validate_document
        IMPORTING
          iv_company_code TYPE bukrs
        RETURNING
          VALUE(rv_success) TYPE abap_bool,

      post_document
        IMPORTING
          iv_company_code TYPE bukrs
          iv_document_date TYPE datum
        RETURNING
          VALUE(rv_success) TYPE abap_bool.

  PRIVATE SECTION.

    METHODS:
      company_code_exists
        IMPORTING
          iv_company_code TYPE bukrs
        RETURNING
          VALUE(rv_exists) TYPE abap_bool.

ENDCLASS.


CLASS zcl_r2r_posting_service IMPLEMENTATION.

  METHOD validate_document.

    IF company_code_exists(
         iv_company_code = iv_company_code ) = abap_true.

      rv_success = abap_true.

    ELSE.

      rv_success = abap_false.

    ENDIF.

  ENDMETHOD.


  METHOD company_code_exists.

    SELECT SINGLE bukrs
      FROM t001
      WHERE bukrs = @iv_company_code
      INTO @DATA(lv_bukrs).

    rv_exists = xsdbool( sy-subrc = 0 ).

  ENDMETHOD.


  METHOD post_document.

    IF validate_document(
         iv_company_code = iv_company_code ) = abap_false.

      rv_success = abap_false.
      RETURN.

    ENDIF.

    rv_success = abap_true.

  ENDMETHOD.

ENDCLASS.`,

      atc_checks: [],

      ai_code_review: [
        {
          category: "Clean Code",
          severity: "INFO",
          findings:
            "Methods are small and responsibilities are clearly separated.",
          comment:
            "The implementation follows a service-oriented structure.",
          recommendation:
            "No major change required.",
          code_reference:
            "METHOD validate_document"
        }
      ],

      ai_overall_assessment: {
        status: "PASS",
        summary:
          "Clean and maintainable ABAP implementation with clear separation of responsibilities."
      }
    },

    // ============================================================
    // 3. INTERFACE
    // ============================================================

    {
      object_name: "ZIF_R2R_POSTING_SERVICE",
      object_type: "INTF",
      object_description:
        "Public contract for accounting posting services.",
      components: [],

      source_code: `INTERFACE zif_r2r_posting_service PUBLIC.

  METHODS validate_document
    IMPORTING
      iv_company_code TYPE bukrs
    RETURNING
      VALUE(rv_valid) TYPE abap_bool.

  METHODS post_document
    IMPORTING
      iv_company_code TYPE bukrs
      iv_document_date TYPE datum
    RETURNING
      VALUE(rv_success) TYPE abap_bool.

ENDINTERFACE.`,

      atc_checks: [],

      ai_code_review: [],

      ai_overall_assessment: {
        status: "PASS",
        summary:
          "Interface definition is concise and provides a clear service contract."
      }
    },

    // ============================================================
    // 4. FUNCTION GROUP
    // AI REVIEW ONLY AT COMPONENT LEVEL
    // ============================================================

    {
      object_name: "ZFG_R2R_SAMPLE",
      object_type: "FUGR",
      object_description:
        "Legacy R2R accounting utility function group.",

      source_code: `FUNCTION-POOL zfg_r2r_sample.

* Function Group:
* ZFG_R2R_SAMPLE
*
* Provides reusable accounting utilities for
* legacy R2R processes.`,

      atc_checks: [
        {
          message:
            "Legacy procedural development object detected.",
          source: "Clean Core",
          severity: "WARNING",
          lineno: 1,
          recommendation:
            "Evaluate whether the functionality can be migrated to ABAP OO or released APIs."
        },
        {
          message:
            "Function group contains globally shared state.",
          source: "ABAP Test Cockpit",
          severity: "WARNING",
          lineno: 1,
          recommendation:
            "Reduce shared global state where technically possible."
        }
      ],

      ai_code_review: [],

      components: [
        {
          component_name: "LZFG_R2R_SAMPLETOP",
          component_type: "INCL",

          source_code: `*----------------------------------------------------------------------*
* Global Data
*----------------------------------------------------------------------*

TABLES:
  bkpf,
  bseg.

DATA:
  gv_company_code TYPE bukrs,
  gv_document     TYPE belnr_d,
  gv_fiscal_year  TYPE gjahr.

TYPES:
  BEGIN OF ty_message,
    type    TYPE symsgty,
    message TYPE string,
  END OF ty_message.

DATA:
  gt_messages TYPE STANDARD TABLE OF ty_message.`,

          source_status: "AVAILABLE",

          ai_code_review: [
            {
              category: "Architecture",
              severity: "WARNING",
              findings:
                "Global mutable state is used.",
              comment:
                "Global variables increase coupling between function modules.",
              recommendation:
                "Prefer local state or encapsulate the logic in an ABAP class.",
              code_reference:
                "DATA: gv_company_code..."
            }
          ],

          ai_overall_assessment: {
            status: "WARNING",
            summary:
              "The include is functional but relies on globally shared mutable state."
          }
        },

        {
          component_name: "LZFG_R2R_SAMPLEU01",
          component_type: "INCL",

          source_code: `FUNCTION zr2r_validate_company_code.

  SELECT SINGLE bukrs
    FROM t001
    INTO @DATA(lv_bukrs)
    WHERE bukrs = @gv_company_code.

  IF sy-subrc = 0.
    ev_valid = abap_true.
  ELSE.
    ev_valid = abap_false.
  ENDIF.

ENDFUNCTION.`,

          source_status: "AVAILABLE",

          ai_code_review: [
            {
              category: "Maintainability",
              severity: "WARNING",
              findings:
                "Function module depends on global function-group data.",
              comment:
                "The company code is read from GV_COMPANY_CODE instead of an explicit importing parameter.",
              recommendation:
                "Pass the company code explicitly to reduce hidden dependencies.",
              code_reference:
                "WHERE bukrs = @gv_company_code"
            }
          ],

          ai_overall_assessment: {
            status: "WARNING",
            summary:
              "Functional implementation with unnecessary dependency on global state."
          }
        },

        {
          component_name: "LZFG_R2R_SAMPLEF01",
          component_type: "INCL",

          source_code: `FORM clear_global_data.

  CLEAR:
    gv_company_code,
    gv_document,
    gv_fiscal_year.

  CLEAR gt_messages.

ENDFORM.`,

          source_status: "AVAILABLE",

          ai_code_review: [
            {
              category: "Modernization",
              severity: "INFO",
              findings:
                "Classical FORM routine is used.",
              comment:
                "FORM routines are supported but less suitable for modern object-oriented development.",
              recommendation:
                "Consider migrating reusable functionality to methods during future modernization.",
              code_reference:
                "FORM clear_global_data"
            }
          ],

          ai_overall_assessment: {
            status: "PASS",
            summary:
              "Simple legacy routine with no significant functional concerns."
          }
        }
      ]
    },

    // ============================================================
    // 5. FUNCTION MODULE
    // ============================================================

    {
      object_name: "ZR2R_GET_COMPANY_DATA",
      object_type: "FUNC",
      object_description:
        "Retrieves company-code master data.",
      components: [],

      source_code: `FUNCTION zr2r_get_company_data.

  SELECT SINGLE
         bukrs,
         butxt,
         ort01,
         land1,
         waers
    FROM t001
    WHERE bukrs = @iv_bukrs
    INTO @DATA(ls_company).

  IF sy-subrc = 0.
    es_company = CORRESPONDING #( ls_company ).
  ENDIF.

ENDFUNCTION.`,

      atc_checks: [
        {
          message:
            "Custom function module should be reviewed for clean-core compatibility.",
          source: "Clean Core",
          severity: "INFO",
          lineno: 1,
          recommendation:
            "Consider exposing reusable logic through an ABAP class where appropriate."
        }
      ],

      ai_code_review: [
        {
          category: "Architecture",
          severity: "INFO",
          findings:
            "Simple database retrieval is implemented as a function module.",
          comment:
            "The implementation is valid but could be encapsulated in an OO service.",
          recommendation:
            "Consider an ABAP class for new development.",
          code_reference:
            "FUNCTION zr2r_get_company_data"
        }
      ],

      ai_overall_assessment: {
        status: "PASS",
        summary:
          "Simple and readable implementation with a minor modernization opportunity."
      }
    },

    // ============================================================
    // 6. CDS DATA DEFINITION
    // ============================================================

    {
      object_name: "ZR2R_I_JOURNALENTRY",
      object_type: "DDLS",
      object_description:
        "R2R journal entry CDS view entity.",
      components: [],

      source_code: `@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'R2R Journal Entry'
@Metadata.ignorePropagatedAnnotations: true

define view entity ZR2R_I_JournalEntry
  as select from I_JournalEntryItem
{
  key CompanyCode,
  key FiscalYear,
  key AccountingDocument,
  key LedgerGLLineItem,

      PostingDate,
      DocumentDate,
      AccountingDocumentType,
      GLAccount,
      CostCenter,
      ProfitCenter,
      TransactionCurrency,
      AmountInTransactionCurrency
}`,

      atc_checks: [],

      ai_code_review: [
        {
          category: "CDS Design",
          severity: "INFO",
          findings:
            "Released interface view is used as the data source.",
          comment:
            "This supports clean-core aligned development.",
          recommendation:
            "Continue using released SAP VDM entities where available.",
          code_reference:
            "as select from I_JournalEntryItem"
        }
      ],

      ai_overall_assessment: {
        status: "PASS",
        summary:
          "Well-structured CDS view using a released SAP interface entity."
      }
    },

    // ============================================================
    // 7. CDS ACCESS CONTROL
    // ============================================================

    {
      object_name: "ZR2R_I_JOURNALENTRY_AC",
      object_type: "DCLS",
      object_description:
        "Authorization control for the R2R journal entry CDS entity.",
      components: [],

      source_code: `@EndUserText.label: 'R2R Journal Entry Authorization'

define role ZR2R_I_JOURNALENTRY_AC {

  grant select on ZR2R_I_JournalEntry
    where
      ( CompanyCode ) =
        aspect pfcg_auth(
          F_BKPF_BUK,
          BUKRS,
          ACTVT = '03'
        );

}`,

      atc_checks: [],

      ai_code_review: [
        {
          category: "Security",
          severity: "INFO",
          findings:
            "PFCG-based authorization control is implemented.",
          comment:
            "Company-code authorization is enforced through DCL.",
          recommendation:
            "Ensure the authorization object and activity align with the business role design.",
          code_reference:
            "aspect pfcg_auth"
        }
      ],

      ai_overall_assessment: {
        status: "PASS",
        summary:
          "Authorization control is explicitly implemented using PFCG authorization."
      }
    },

    // ============================================================
    // 8. CDS METADATA EXTENSION
    // ============================================================

    {
      object_name: "ZR2R_C_JOURNALENTRY_MDE",
      object_type: "DDLX",
      object_description:
        "Fiori metadata extension for journal entry review.",
      components: [],

      source_code: `@Metadata.layer: #CUSTOMER

annotate entity ZR2R_C_JournalEntry with
{
  @UI.lineItem: [
    { position: 10, importance: #HIGH }
  ]
  CompanyCode;

  @UI.lineItem: [
    { position: 20, importance: #HIGH }
  ]
  AccountingDocument;

  @UI.lineItem: [
    { position: 30 }
  ]
  FiscalYear;

  @UI.lineItem: [
    { position: 40 }
  ]
  PostingDate;

  @UI.lineItem: [
    { position: 50 }
  ]
  GLAccount;
}`,

      atc_checks: [
        {
          message:
            "Consider additional identification annotations.",
          source: "Fiori Elements",
          severity: "INFO",
          lineno: 4,
          recommendation:
            "Add UI identification annotations if an object page is required."
        }
      ],

      ai_code_review: [
        {
          category: "Fiori Elements",
          severity: "INFO",
          findings:
            "Line-item annotations are clearly separated in a metadata extension.",
          comment:
            "The design keeps UI annotations separate from the CDS data model.",
          recommendation:
            "Add header and identification annotations if required by the application.",
          code_reference:
            "@UI.lineItem"
        }
      ],

      ai_overall_assessment: {
        status: "PASS",
        summary:
          "Clean metadata-extension design suitable for a Fiori Elements application."
      }
    },

    // ============================================================
    // 9. RAP BEHAVIOR DEFINITION
    // ============================================================

    {
      object_name: "ZR2R_I_JOURNALENTRY",
      object_type: "BDEF",
      object_description:
        "RAP behavior definition for journal entry processing.",
      components: [],

      source_code: `managed implementation in class zbp_r2r_i_journalentry unique;
strict ( 2 );

define behavior for ZR2R_I_JournalEntry alias JournalEntry
persistent table zr2r_je
lock master
authorization master ( instance )
etag master LocalLastChangedAt
{
  create;
  update;
  delete;

  field ( readonly )
    AccountingDocument,
    FiscalYear;

  validation validateCompanyCode
    on save { create; update; }

  determination setFiscalYear
    on modify { create; }

  action approve
    result [1] $self;

  mapping for zr2r_je
  {
    CompanyCode        = bukrs;
    AccountingDocument = belnr;
    FiscalYear         = gjahr;
  }
}`,

      atc_checks: [
        {
          message:
            "Authorization implementation must be verified.",
          source: "RAP",
          severity: "WARNING",
          lineno: 7,
          recommendation:
            "Ensure instance authorization is implemented in the behavior pool."
        }
      ],

      ai_code_review: [
        {
          category: "RAP",
          severity: "INFO",
          findings:
            "Managed RAP behavior uses validation and determination hooks.",
          comment:
            "The behavior definition follows a modern transactional design.",
          recommendation:
            "Ensure validations return meaningful RAP messages.",
          code_reference:
            "validation validateCompanyCode"
        },
        {
          category: "Security",
          severity: "WARNING",
          findings:
            "Instance authorization requires corresponding implementation.",
          comment:
            "The behavior declares authorization master instance.",
          recommendation:
            "Verify GET_INSTANCE_AUTHORIZATIONS implementation.",
          code_reference:
            "authorization master ( instance )"
        }
      ],

      ai_overall_assessment: {
        status: "WARNING",
        summary:
          "Modern RAP design with an authorization implementation that should be verified."
      }
    },

    // ============================================================
    // 10. SERVICE DEFINITION
    // ============================================================

    {
      object_name: "ZR2R_UI_JOURNALENTRY",
      object_type: "SRVD",
      object_description:
        "RAP service definition for journal entry processing.",
      components: [],

      source_code: `@EndUserText.label: 'R2R Journal Entry Service'

define service ZR2R_UI_JOURNALENTRY {
  expose ZR2R_C_JournalEntry as JournalEntry;
  expose ZR2R_C_CompanyCode  as CompanyCode;
}`,

      atc_checks: [],

      ai_code_review: [],

      ai_overall_assessment: {
        status: "PASS",
        summary:
          "Service definition is minimal and exposes the required RAP entities."
      }
    },

    // ============================================================
    // 11. SECOND ABAP CLASS — INTENTIONAL FAILURE
    // ============================================================

    {
      object_name: "ZCL_R2R_LEGACY_PROCESSOR",
      object_type: "CLAS",
      object_description:
        "Legacy financial document processing utility.",
      components: [],

      source_code: `CLASS zcl_r2r_legacy_processor DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.

    METHODS process_documents.

ENDCLASS.


CLASS zcl_r2r_legacy_processor IMPLEMENTATION.

  METHOD process_documents.

    SELECT *
      FROM bkpf
      INTO TABLE @DATA(lt_bkpf).

    LOOP AT lt_bkpf INTO DATA(ls_bkpf).

      SELECT *
        FROM bseg
        WHERE bukrs = @ls_bkpf-bukrs
          AND belnr = @ls_bkpf-belnr
          AND gjahr = @ls_bkpf-gjahr
        INTO TABLE @DATA(lt_bseg).

      LOOP AT lt_bseg INTO DATA(ls_bseg).

        WRITE:
          / ls_bseg-bukrs,
            ls_bseg-belnr,
            ls_bseg-hkont.

      ENDLOOP.

    ENDLOOP.

  ENDMETHOD.

ENDCLASS.`,

      atc_checks: [
        {
          message:
            "SELECT * retrieves unnecessary database columns.",
          source: "ABAP Test Cockpit",
          severity: "ERROR",
          lineno: 15,
          recommendation:
            "Select only fields required by the application."
        },
        {
          message:
            "Database SELECT detected inside LOOP.",
          source: "ABAP Test Cockpit",
          severity: "ERROR",
          lineno: 21,
          recommendation:
            "Avoid repeated database access inside loops. Retrieve required data before processing."
        },
        {
          message:
            "Potential unrestricted database selection.",
          source: "Performance",
          severity: "ERROR",
          lineno: 15,
          recommendation:
            "Introduce appropriate selection criteria."
        }
      ],

      ai_code_review: [
        {
          category: "Performance",
          severity: "ERROR",
          findings:
            "Nested database access can cause significant performance degradation.",
          comment:
            "BSEG is selected repeatedly for every BKPF entry.",
          recommendation:
            "Redesign data retrieval using an appropriate joined or set-based approach.",
          code_reference:
            "LOOP AT lt_bkpf ... SELECT ... FROM bseg"
        },
        {
          category: "Performance",
          severity: "ERROR",
          findings:
            "Unrestricted SELECT * is performed against BKPF.",
          comment:
            "This can retrieve a very large dataset.",
          recommendation:
            "Apply business filters and retrieve only required fields.",
          code_reference:
            "SELECT * FROM bkpf"
        },
        {
          category: "Modernization",
          severity: "WARNING",
          findings:
            "Classical WRITE output is embedded in the processing class.",
          comment:
            "Presentation and processing responsibilities are mixed.",
          recommendation:
            "Return structured results to the consuming application.",
          code_reference:
            "WRITE:"
        }
      ],

      ai_overall_assessment: {
        status: "FAIL",
        summary:
          "Significant performance and architecture issues should be resolved before production use."
      }
    },

    // ============================================================
    // 12. SECOND CDS VIEW
    // ============================================================

    {
      object_name: "ZO2C_I_SALESORDER",
      object_type: "DDLS",
      object_description:
        "Sales order analytical interface view.",
      components: [],

      source_code: `@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Sales Order Analysis'

define view entity ZO2C_I_SalesOrder
  as select from I_SalesOrder as SalesOrder

  association [0..*] to I_SalesOrderItem as _Item
    on $projection.SalesOrder = _Item.SalesOrder
{
  key SalesOrder.SalesOrder,
      SalesOrder.SalesOrderType,
      SalesOrder.SalesOrganization,
      SalesOrder.DistributionChannel,
      SalesOrder.OrganizationDivision,
      SalesOrder.SoldToParty,
      SalesOrder.CreationDate,

      _Item
}`,

      atc_checks: [],

      ai_code_review: [
        {
          category: "CDS Design",
          severity: "INFO",
          findings:
            "Association is exposed for on-demand consumption.",
          comment:
            "The model avoids unnecessary eager joins.",
          recommendation:
            "No change required.",
          code_reference:
            "association [0..*] to I_SalesOrderItem"
        }
      ],

      ai_overall_assessment: {
        status: "PASS",
        summary:
          "Clean CDS model using released VDM entities and associations."
      }
    },

    // ============================================================
    // 13. P2P PROGRAM
    // ============================================================

    {
      object_name: "ZP2P_VENDOR_ANALYSIS",
      object_type: "PROG",
      object_description:
        "Vendor purchasing analysis report.",
      components: [],

      source_code: `REPORT zp2p_vendor_analysis.

PARAMETERS:
  p_lifnr TYPE lifnr.

START-OF-SELECTION.

  SELECT lifnr,
         name1,
         land1
    FROM lfa1
    WHERE lifnr = @p_lifnr
    INTO TABLE @DATA(lt_vendor).

  LOOP AT lt_vendor INTO DATA(ls_vendor).

    WRITE:
      / ls_vendor-lifnr,
        ls_vendor-name1,
        ls_vendor-land1.

  ENDLOOP.`,

      atc_checks: [
        {
          message:
            "Classical list output detected.",
          source: "Modernization",
          severity: "INFO",
          lineno: 16,
          recommendation:
            "Consider a modern UI technology for new development."
        }
      ],

      ai_code_review: [
        {
          category: "Modernization",
          severity: "WARNING",
          findings:
            "Classical report output is used.",
          comment:
            "The implementation is simple but not aligned with modern Fiori UX.",
          recommendation:
            "Consider RAP/Fiori Elements if this report is actively used.",
          code_reference:
            "WRITE:"
        }
      ],

      ai_overall_assessment: {
        status: "WARNING",
        summary:
          "Functional implementation with a modernization opportunity."
      }
    },

    // ============================================================
    // 14. RAP PROJECTION BEHAVIOR
    // ============================================================

    {
      object_name: "ZR2R_C_JOURNALENTRY",
      object_type: "BDEF",
      object_description:
        "RAP projection behavior for journal entry application.",
      components: [],

      source_code: `projection;
strict ( 2 );

define behavior for ZR2R_C_JournalEntry alias JournalEntry
{
  use create;
  use update;
  use delete;

  use action approve;
}`,

      atc_checks: [],

      ai_code_review: [],

      ai_overall_assessment: {
        status: "PASS",
        summary:
          "Projection behavior cleanly exposes the required transactional operations."
      }
    },

    // ============================================================
    // 15. UTILITY CLASS
    // ============================================================

    {
      object_name: "ZCL_COMMON_DATE_UTIL",
      object_type: "CLAS",
      object_description:
        "Shared date and fiscal-period utility class.",
      components: [],

      source_code: `CLASS zcl_common_date_util DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.

    CLASS-METHODS get_fiscal_year
      IMPORTING
        iv_date TYPE datum
      RETURNING
        VALUE(rv_year) TYPE gjahr.

ENDCLASS.


CLASS zcl_common_date_util IMPLEMENTATION.

  METHOD get_fiscal_year.

    rv_year = iv_date(4).

  ENDMETHOD.

ENDCLASS.`,

      atc_checks: [
        {
          message:
            "Fiscal-year calculation may not support non-calendar fiscal variants.",
          source: "Functional Review",
          severity: "WARNING",
          lineno: 17,
          recommendation:
            "Determine fiscal year using the relevant fiscal-year variant rather than extracting the calendar year."
        }
      ],

      ai_code_review: [
        {
          category: "Functional Correctness",
          severity: "WARNING",
          findings:
            "Calendar year is assumed to equal fiscal year.",
          comment:
            "This assumption is not valid for all company-code fiscal-year variants.",
          recommendation:
            "Use company-code/fiscal-year variant-aware logic.",
          code_reference:
            "rv_year = iv_date(4)"
        },
        {
          category: "Maintainability",
          severity: "INFO",
          findings:
            "Utility API is small and clearly named.",
          comment:
            "The class is easy to consume.",
          recommendation:
            "Retain the interface but improve the fiscal-year calculation.",
          code_reference:
            "CLASS-METHODS get_fiscal_year"
        }
      ],

      ai_overall_assessment: {
        status: "WARNING",
        summary:
          "Clean utility design, but the fiscal-year calculation has a functional limitation."
      }
    }
  ]
};
