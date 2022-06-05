import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { injectEmptyCy, addElementsToCy } from "../../utils";
import TMLabelHandler from "./TMLabelHandler";
import TMModel from "./TMModel";

function TMComponent({ cyref, model, updateModel = () => {} }) {
  const CY_ID = `cy-${uuidv4()}`;
  const LabelHandler = useRef(null);
  const tapesCount = model.tapesCount;

  useEffect(() => {
    const graphElements = model ? model.elements : [];

    console.log("[TMComponent] useEffect");
    cyref.current = injectEmptyCy(CY_ID);
    addElementsToCy(cyref.current, graphElements);
    cyref.current.layout({ name: "cose" }).run();

    LabelHandler.current = new TMLabelHandler(tapesCount);
    LabelHandler.current.attatchEventListeners(cyref.current);

    cyref.current.on("add remove data", (e) => {
      console.log("Updating the model", e);
      updateModel(
        new TMModel(addNameToNodes(e.cy.json().elements), tapesCount)
      );
    });
  }, []);

  const addNameToNodes = (elementsObj) => {
    // for some reason cy.json().elments strips out the name property from the nodes

    elementsObj.nodes?.forEach((node) => {
      node.data.name = node.data.label;
    });

    return elementsObj;
  };

  return <div id={CY_ID} className="cy"></div>;
}

export default TMComponent;
