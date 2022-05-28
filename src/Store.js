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
let elm0 = machineExamples.elm0;
addLabelDataForExampleElements(elm0, tabTypes.FA);
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
  // { title: "deleteme" },
  {
    title: "RegEx STUB",
    tabType: tabTypes.RE,
    model: new REModel("ab*(c)"),
  },
  {
    title: "Grammar g1 STUB",
    tabType: tabTypes.GR,
    model: new GRModel(grammarExamples.g5),
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
    model: new FSAModel(elm0),
  },
  {
    tabType: tabTypes.FA,
    title: "NFA 2 STUB",
    model: new FSAModel(elm1),
  },
  {
    tabType: tabTypes.FA,
    title: "FSAtoRE STUB",
    model: new FSAModel(machineExamples.elmFSAtoRE),
  },
];

export const StoreContext = React.createContext();
export const UtilityContext = React.createContext();

const Store = ({ children }) => {
  const [store, setStore] = useState(initialState);

  const initalSelectedTab = store.length - 1 < 0 ? null : store.length - 1;
  const forcedSelectedTab = 8;
  const [activeTabKey, setActiveTabKey] = useState(forcedSelectedTab);
  // null means is not any tab is selected

  const _addUniqueLabel = (baseLabel) => {
    const existCount = store.filter((tab) =>
      tab.title.includes(baseLabel)
    ).length;
    if (existCount === 0) return baseLabel;
    return baseLabel + " " + existCount;
  };

  const addTab = (info) => {
    console.log("[Utility] addTab");

    info.title = _addUniqueLabel(info.title);
    const newStore = [...store, info];
    setStore(newStore);

    const newActiveIdx = newStore.length - 1;
    setActiveTabKey(newActiveIdx);
  };

  const removeTab = (tabNr) => {
    console.log("[Utility] removeTab");
    const newStore = [...store];
    newStore.splice(tabNr, 1);
    setStore(newStore);

    // stay on the same idx if possible, otherwise select one before the removed one
    const newActiveIdx =
      newStore.length - 1 < activeTabKey ? activeTabKey - 1 : activeTabKey;
    setActiveTabKey(newActiveIdx < 0 ? null : newActiveIdx);
  };

  const storeActions = { addTab, removeTab };

  return (
    <StoreContext.Provider
      value={{ activeTabKey, setActiveTabKey, store, setStore, storeActions }}
    >
      {/* <UtilityContext.Provider value={{ addTab }}> */}
      {children}
      {/* </UtilityContext.Provider> */}
    </StoreContext.Provider>
  );
};

export default Store;
