import React, { useState, useRef } from "react";
const initialState = [
  { shown: false, cyinst: undefined, inputString: undefined, configs: [] },
  { shown: false, cyinst: undefined, inputString: undefined, configs: [] },
];

export const StoreContext = React.createContext();
export const UtilityContext = React.createContext();

const Store = ({ children }) => {
  const [store, setstore] = useState(initialState);
  const addTab = () => {
    console.log("[Utility] addTab");
    setstore((prev) => [
      ...prev,
      { shown: false, cyinst: undefined, inputString: undefined, configs: [] },
    ]);
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
