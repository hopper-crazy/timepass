export const SAP_SYSTEMS = [
  {
    value: "DS4",
    label: "DS4",
    description: "S/4HANA Development",
  },
  {
    value: "DFE",
    label: "DFE",
    description: "S/4HANA FIORI Development",
  },
  {
    value: "DS5",
    label: "DS5",
    description: "S/4HANA (N+1) Development",
  },
  {
    value: "DF5",
    label: "DF5",
    description: "S/4HANA (N+1) FIORI Development",
  },
];

export const getSystemByValue = (value) =>
  SAP_SYSTEMS.find((system) => system.value === value);
