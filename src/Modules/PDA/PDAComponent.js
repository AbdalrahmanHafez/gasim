import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { injectEmptyCy, addElementsToCy } from "../../utils";
import PDALabelHandler from "./PDALabelHandler";
import PDAModel from "./PDAModel";

function PDAComponent({ cyref, model, updateModel }) {
  const CY_ID = `cy-${uuidv4()}`;
  const LabelHandler = useRef(null);

  useEffect(() => {
    const graphElements = model ? model.elements : [];

    console.log("[PDAComponent] useEffect");
    cyref.current = injectEmptyCy(CY_ID);
    addElementsToCy(cyref.current, graphElements);
    cyref.current.layout({ name: "cose" }).run();

    LabelHandler.current = new PDALabelHandler();
    LabelHandler.current.attatchEventListeners(cyref.current);

    cyref.current.on("add remove data", (e) => {
      // cyref.current.on("add remove", (e) => {
      console.log("Updating the model", e);
      // console.log(e);
      updateModel(new PDAModel(e.cy.json().elements));
    });
  }, []);

  return <div id={CY_ID} className="cy"></div>;
}

export default PDAComponent;
