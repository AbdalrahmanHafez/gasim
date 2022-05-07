import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { injectEmptyCy, addElementsToCy } from "../../utils";
import FSALabelHandler from "./FSALabelHandler";

function FSAComponent({ cyref, model }) {
  const CY_ID = `cy-${uuidv4()}`;
  const LabelHandler = useRef(null);

  // NOTE: the model does not represent the current state of the FSA graph,
  // it is only used to instantiate the graph a profived data.
  useEffect(() => {
    const graphElements = model ? model.elements : [];

    console.log("[FSAComponent] useEffect");
    cyref.current = injectEmptyCy(CY_ID);
    addElementsToCy(cyref.current, graphElements);
    cyref.current.layout({ name: "cose" }).run();

    LabelHandler.current = new FSALabelHandler();
    LabelHandler.current.attatchEventListeners(cyref.current);
  }, []);

  return <div id={CY_ID} className="cy"></div>;
}

export default FSAComponent;
