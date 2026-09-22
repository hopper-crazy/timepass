export const OBJECT_TYPES = {
  PROG: "ABAP Program",
  CLAS: "ABAP Class",
  INTF: "ABAP Interface",
  FUGR: "Function Group",
  FUNC: "Function Module",
  INCL: "ABAP Include",
  DDLS: "CDS Data Definition",
  DCLS: "CDS Access Control",
  DDLX: "CDS Metadata Extension",
  BDEF: "Behavior Definition",
  SRVD: "Service Definition",
  METH: "ABAP Class Method",
};

export const getObjectTypeLabel = (type) => {
  return OBJECT_TYPES[type] || type || "SAP Object";
};