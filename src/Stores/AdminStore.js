import React, { useState, useRef } from "react";
import tabTypes from "../enums/tabTypes";
import { grammarExamples, machineExamples } from "../Helpers/Constatns";
import { FSAModel } from "../Modules/FSA";
import { PDAModel } from "../Modules/PDA";
import { TMModel } from "../Modules/TM";
import { GRModel } from "../Modules/GR";
import { REModel } from "../Modules/RE";
import { addLabelDataForExampleElements } from "../utils";

export const AdminStoreCtx = React.createContext();

const AdminStore = ({ children }) => {
  const [exData, setExData] = useState([]);
  const [viewEx, setViewEx] = useState(null);

  return (
    <AdminStoreCtx.Provider value={{ exData, setExData, viewEx, setViewEx }}>
      {children}
    </AdminStoreCtx.Provider>
  );
};

export default AdminStore;
