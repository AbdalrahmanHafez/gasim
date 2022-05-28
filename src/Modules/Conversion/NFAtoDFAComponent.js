import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { addElementsToCy, injectEmptyCy, getNodeClosure } from "../../utils";
import { Set, is } from "immutable";

function NFAtoDFAComponent({ model, editable }) {
  const CY_ID = `cy-${uuidv4()}`;
  const cy = useRef(null);

  useEffect(() => {
    console.log("[NFAtoDFAComponent] useEffect");
    cy.current = injectEmptyCy(CY_ID, { editable: editable });

    // addElementsToCy(cyref.current, graphElements);
    // cy.current.layout({ name: "cose" }).run();

    // TODO: don't show the right panel if conversion failed. look into FSAView.js
    try {
      model.convert(cy.current);
    } catch (error) {
      alert(error);
    }
  }, [model, CY_ID]);

  return <div id={CY_ID} className="cy"></div>;
}

export default NFAtoDFAComponent;
