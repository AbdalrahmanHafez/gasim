import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { addElementsToCy, injectEmptyCy, getNodeClosure } from "../../utils";
import { Set, is } from "immutable";

function GRtoPDAComponent({ model, editable }) {
  const CY_ID = `cy-${uuidv4()}`;
  const cy = useRef(null);

  useEffect(() => {
    console.log("[GRtoPDAComponent] useEffect");
    cy.current = injectEmptyCy(CY_ID, { editable: editable });

    // addElementsToCy(cyref.current, graphElements);
    // cy.current.layout({ name: "cose" }).run();

    model.convert(cy.current);
  }, []);

  return <div id={CY_ID} className="cy"></div>;
}

export default GRtoPDAComponent;
