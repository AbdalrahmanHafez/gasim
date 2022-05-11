import React, { useState, useRef } from "react";
import tabTypes from "./enums/tabTypes";
import { grammarExamples, machineExamples } from "./Helpers/Constatns";
import { parseExampleLabels } from "./Helpers/GraphLabel";
import { FSAModel } from "./Modules/FSA/";
import { PDAModel } from "./Modules/PDA/";
import { TMModel } from "./Modules/TM/";
import { GRModel } from "./Modules/GR/";
import { REModel } from "./Modules/RE/";

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
let elmTM = machineExamples.elmTM;
let elmTM2 = machineExamples.elmTM2;
let elmTM3 = machineExamples.elmTM3;
addLabelDataForExampleElements(elmTM, tabTypes.TM);
addLabelDataForExampleElements(elmTM2, tabTypes.TM);
addLabelDataForExampleElements(elmTM3, tabTypes.TM);
let elmPDAtoGR = machineExamples.elmPDAtoGR;
addLabelDataForExampleElements(elmPDAtoGR, tabTypes.PDA);

const initialState = [
  {
    title: "RegEx STUB",
    tabType: tabTypes.RE,
    model: new REModel("ab*(c)"),
  },
  {
    title: "Grammar STUB",
    tabType: tabTypes.GR,
    model: new GRModel(grammarExamples.g1),
  },
  { title: "TM 1 STUB", tabType: tabTypes.TM, model: new TMModel(elmTM, 2) },
  { title: "TM 2 STUB", tabType: tabTypes.TM, model: new TMModel(elmTM2, 1) },
  { title: "TM 3 STUB", tabType: tabTypes.TM, model: new TMModel(elmTM3, 2) },
  {
    tabType: tabTypes.PDA,
    title: "PDAtoGR STUB",
    model: new PDAModel(elmPDAtoGR),
  },
  {
    tabType: tabTypes.PDA,
    title: "PDA STUB",
    model: new PDAModel(elmPDA),
  },
  {
    tabType: tabTypes.FA,
    title: "NFA STUB",
    model: new FSAModel(elm1),
  },
  {
    tabType: tabTypes.FA,
    title: "FSAtoRE STUB",
    model: new FSAModel(machineExamples.elmFSAtoRE),
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
