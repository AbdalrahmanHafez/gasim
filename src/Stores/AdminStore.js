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

export const AdminViews = {
  LIST_ALL: "View list of all Exercises",
  VIEW_EXE: "View a single Exercises",
  ADD_EXE: "Add Exercise",
  EDIT_EXE: "Edit Exercise",
};

const initalAdminView = {
  type: AdminViews.LIST_ALL,
};

const AdminStore = ({ children }) => {
  const [exData, setExData] = useState([]);
  const [view, setView] = useState(initalAdminView);

  return (
    <AdminStoreCtx.Provider value={{ exData, setExData, view, setView }}>
      {children}
    </AdminStoreCtx.Provider>
  );
};

export default AdminStore;
