import React, { useState, useRef } from "react";

export const AdminStoreCtx = React.createContext();

export const AdminViews = {
  LIST_ALL: "View list of all Exercises",
  VIEW_EXE: "View a single Exercises",
};

const initalAdminView = {
  type: AdminViews.LIST_ALL,
};

const AdminStore = ({ children }) => {
  const [exData, setExData] = useState(undefined);
  const [view, setView] = useState(initalAdminView);

  return (
    <AdminStoreCtx.Provider value={{ exData, setExData, view, setView }}>
      {children}
    </AdminStoreCtx.Provider>
  );
};

export default AdminStore;
