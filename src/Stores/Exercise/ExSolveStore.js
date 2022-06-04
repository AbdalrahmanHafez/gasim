import React, { useState } from "react";

export const ExSolveStoreCtx = React.createContext();

const ExSolveStore = ({ children }) => {
  const [answers, setAnswers] = useState(new Map());

  return (
    <ExSolveStoreCtx.Provider
      value={{
        answers,
        setAnswers,
      }}
    >
      {children}
    </ExSolveStoreCtx.Provider>
  );
};

export default ExSolveStore;
