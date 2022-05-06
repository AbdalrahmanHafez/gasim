import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { injectEmptyCy, addElementsToCy } from "../../utils";
import TMLabelHandler from "./TMLabelHandler";

function TMComponent({ cyref, model }) {
  const CY_ID = `cy-${uuidv4()}`;
  const LabelHandler = useRef(null);
  const tapesCount = model.tapesCount;

  useEffect(() => {
    console.log("[TMComponent] useEffect");
    cyref.current = injectEmptyCy(CY_ID);
    addElementsToCy(cyref.current, model.elements);
    cyref.current.layout({ name: "cose" }).run();

    LabelHandler.current = new TMLabelHandler(tapesCount);
    LabelHandler.current.attatchEventListeners(cyref.current);
  }, []);

  return <div id={CY_ID} className="cy"></div>;
}

export default TMComponent;
