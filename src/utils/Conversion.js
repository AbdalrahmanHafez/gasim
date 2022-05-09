import tabTypes from "../enums/tabTypes";

export const tabTypeToConversionOptions = (tabType) => {
  switch (tabType) {
    case tabTypes.FA:
      return [tabTypes.NFAtoDFA, tabTypes.FSAtoRE];

    case tabTypes.GR:
      return [tabTypes.GRtoPDA];

    case tabTypes.RE:
      return [tabTypes.REtoNFA];

    case tabTypes.PDA:
      return [tabTypes.PDAtoGR];

    default:
      return [];
  }
};
