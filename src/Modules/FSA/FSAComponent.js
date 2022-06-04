import React, { useContext, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { injectEmptyCy, addElementsToCy } from "../../utils";
import FSALabelHandler from "./FSALabelHandler";
import { StoreContext } from "../../Stores/Store";
import FSAModel from "./FSAModel";

function FSAComponent({ cyref, model, updateModel }) {
  const CY_ID = `cy-${uuidv4()}`;
  const LabelHandler = useRef(null);

  console.log("[FSAComponent] render");
  // console.log("model is ", model);

  // const updateModel = (newModel) => {
  //   setStore((store) => {
  //     const newStore = [...store];
  //     newStore[6].model = newModel;
  //     return newStore;
  //   });
  // };

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

    cyref.current.on("add remove data", (e) => {
      // cyref.current.on("add remove", (e) => {
      console.log("Updating the model", e);
      // console.log(e);
      updateModel(new FSAModel(addNameToNodes(e.cy.json().elements)));
    });
  }, []);

  return <div id={CY_ID} className="cy"></div>;
}

const addNameToNodes = (elementsObj) => {
  // for some reason cy.json().elments strips out the name property from the nodes

  elementsObj.nodes?.forEach((node) => {
    node.data.name = node.data.label;
  });

  return elementsObj;
};

export default FSAComponent;
