import React, { useState, useRef } from "react";
import tabType from "./enums/tabTypes";

// TODO: consider making it (tabType, simulationtype) pair
const initialState = [
  { tabType: tabType.FA },
  { tabType: tabType.FA },
  { tabType: tabType.FA },
  { tabType: tabType.PDA },
  { tabType: tabType.TM },
  { tabType: tabType.TM },
  { tabType: tabType.TM },
  { tabType: tabType.IFD, simType: tabType.FA },
];

export const StoreContext = React.createContext();
export const UtilityContext = React.createContext();

const Store = ({ children }) => {
  const [store, setstore] = useState(initialState);

  const addTab = () => {
    console.log("[Utility] addTab");
    setstore((prev) => [...prev, {}]);
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
