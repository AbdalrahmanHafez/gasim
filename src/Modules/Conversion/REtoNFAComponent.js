import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { addElementsToCy, injectEmptyCy, getNodeClosure } from "../../utils";
import { Set, is } from "immutable";

function REtoNFAComponent({ model }) {
  const CY_ID = `cy-${uuidv4()}`;
  const cy = useRef(null);

  useEffect(() => {
    console.log("[REtoNFACompoenn] useEffect");
    cy.current = injectEmptyCy(CY_ID, { editable: false });

    try {
      model.convert(cy.current);
      // TODO: don't show the conversion result in REtoNFAview if it failed
    } catch (error) {
      alert(error);
    }

    cy.current.layout({ name: "cose" }).run();
  }, [model]);

  return <div id={CY_ID} className="cy"></div>;
}

export default REtoNFAComponent;
