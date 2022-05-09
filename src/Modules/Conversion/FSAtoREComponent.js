import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { addElementsToCy, injectEmptyCy, getNodeClosure } from "../../utils";
import { Button, Input } from "antd";

function FSAtoREComponent({ model }) {
  const [inputValue, setInputValue] = useState("Loading...");
  const CY_ID = `cy-${uuidv4()}`;
  const cy = useRef(null);

  useEffect(() => {
    async function fetchData() {
      console.log("[FSAtoREcomponent] useEffect");
      cy.current = injectEmptyCy(CY_ID);
      addElementsToCy(cy.current, model.FSAModel.elements);

      const resultREexp = model.convert(cy.current);

      console.log("FSAtoRE result is ", resultREexp);

      cy.current.layout({ name: "cose" }).run();

      setInputValue(resultREexp);
    }

    fetchData();
  }, []);

  return (
    <>
      <Input value={inputValue} />
      <div id={CY_ID} className="cy"></div>;
    </>
  );
}

export default FSAtoREComponent;
