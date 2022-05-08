import tabTypes from "../enums/tabTypes";

export const tabTypeToConversionOptions = (tabType) => {
  switch (tabType) {
    case tabTypes.FA:
      return [tabTypes.NFAtoDFA, tabTypes.NFAtoRE];

    case tabTypes.GR:
      return [tabTypes.GRtoPDA];

    case tabTypes.RE:
      return [tabTypes.REtooNFA];

    case tabTypes.PDA:
      return [tabTypes.PDAtoGR];

    default:
      throw new Error("Unknown tab type inside tabTypeToConversionOptions");
  }
};
