import { Button } from "antd";
import React, { useContext } from "react";
import { StoreContext } from "../Stores/Store";

function ExportButton({ tabObj, modelEvalFn, ...rest }) {
  /**
   *  ModelEvalFn is a function to set the model in the tab store
   *    each tab has {title, tabType, model}
   *    the first two title and tabType are provided by the tabObj
   */

  const {
    storeActions: { addTab },
  } = useContext(StoreContext);

  const handleExportBtn = () => {
    console.log("ExportBtn Clicked");
    // Expected given tabObj
    // {title: ..., tabType: ...}

    // adding the model to the given tabObject
    tabObj.model = modelEvalFn();

    addTab(tabObj);
  };

  return (
    <Button onClick={handleExportBtn} {...rest}>
      Export
    </Button>
  );
}

export default ExportButton;
