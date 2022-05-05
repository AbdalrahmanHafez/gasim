import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { injectEmptyCy, addElementsToCy } from "../../utils";

function FSAComponent({ cyref, model }) {
  const CY_ID = `cy-${uuidv4()}`;

  useEffect(() => {
    console.log("[FSAComponent] useEffect");
    cyref.current = injectEmptyCy(CY_ID);
    addElementsToCy(cyref.current, model.elements);
    cyref.current.layout({ name: "cose" }).run();
  }, []);

  return <div id={CY_ID} className="cy"></div>;
}

export default FSAComponent;
