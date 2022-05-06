import React, { useState, useRef } from "react";
import conversionType from "./enums/conversionType";
import tabTypes from "./enums/tabTypes";
import { machineExamples } from "./Helpers/Constatns";
import { parseExampleLabels } from "./Helpers/GraphLabel";
import { FSAModel } from "./Modules/FSA/";

const addLabelDataForExampleElements = (elements, tabType) => {
  elements.edges?.forEach((edge) => {
    edge.data = {
      ...edge.data,
      ...parseExampleLabels(edge.data.label, tabType),
    };
  });
};
// TODO: consider making it (tabType, simulationtype) pair
/**
 * Each {tabType: tabTypes, title: string, simType: tabType, showConversion:boolean}
 */
let elm1 = machineExamples.elm1;
addLabelDataForExampleElements(elm1, tabTypes.FA);
let elmPDA = machineExamples.elmPDA;
addLabelDataForExampleElements(elmPDA, tabTypes.PDA);

const initialState = [
  {
    tabType: tabTypes.PDA,
    title: "STUB PDA remove me",
    // model: new PDAModel(elm1),
  },
  {
    tabType: tabTypes.FA,
    title: "STUB NFA remove me",
    model: new FSAModel(elm1),
  },
];
// { tabType: tabTypes.FA, title: "NFA 1", showConversion: false },
// { tabType: tabTypes.FA, title: "NFA 2" },
// { tabType: tabTypes.FA, title: "NFA 3" },
// { tabType: tabTypes.PDA, title: "PDA" },
// { tabType: tabTypes.TM, title: "MTTM" },
// { tabType: tabTypes.TM, title: "TM" },
// { tabType: tabTypes.TM, title: "Enum" },
// { tabType: tabTypes.IFD, simType: tabTypes.FA, title: "IFD" },
// {
//   tabType: tabTypes.FA,
//   title: "NFA Conversion",
//   showConversion: false,
// },
// { tabType: tabTypes.GR, title: "Grammar" },
// { tabType: tabTypes.GR, title: "GrammarToPDA" },
// { tabType: tabTypes.PDA, title: "PDAtoGrammar" },
// { tabType: tabTypes.RE, title: "RE" },

export const StoreContext = React.createContext();
export const UtilityContext = React.createContext();

const Store = ({ children }) => {
  const [store, setStore] = useState(initialState);

  const addTab = (info) => {
    console.log("[Utility] addTab");
    setStore((prev) => [...prev, info]);
  };

  const storeActions = { addTab };

  return (
    <StoreContext.Provider value={[store, setStore, storeActions]}>
      {/* <UtilityContext.Provider value={{ addTab }}> */}
      {children}
      {/* </UtilityContext.Provider> */}
    </StoreContext.Provider>
  );
};

export default Store;
