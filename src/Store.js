import React, { useState, useRef } from "react";
import tabTypes from "./enums/tabTypes";

// TODO: consider making it (tabType, simulationtype) pair
const initialState = [
  { tabType: tabTypes.FA, title: "NFA 1" },
  { tabType: tabTypes.FA, title: "NFA 2" },
  { tabType: tabTypes.FA, title: "NFA 3" },
  { tabType: tabTypes.PDA, title: "PDA" },
  { tabType: tabTypes.TM, title: "MTTM" },
  { tabType: tabTypes.TM, title: "TM" },
  { tabType: tabTypes.TM, title: "Enum" },
  { tabType: tabTypes.IFD, simType: tabTypes.FA, title: "IFD" },
];

export const StoreContext = React.createContext();
export const UtilityContext = React.createContext();

const Store = ({ children }) => {
  const [store, setstore] = useState(initialState);

  const addTab = (info) => {
    console.log("[Utility] addTab");
    setstore((prev) => [...prev, info]);
  };

  return (
    <StoreContext.Provider value={[store, setstore]}>
      <UtilityContext.Provider value={{ addTab }}>
        {children}
      </UtilityContext.Provider>
    </StoreContext.Provider>
  );
};

export default Store;
