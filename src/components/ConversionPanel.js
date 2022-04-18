import React, { useEffect, useState } from "react";

const CY_ELM_ID = "cy-conversion";

const CyElm = ({ ui }) => {
  useEffect(() => {
    console.log("[CyElm] useEffect");

    const cy = ui.injectCyForConversion(CY_ELM_ID, { nodes: [], edges: [] });
  }, [ui]);

  return <div id={CY_ELM_ID} className="cy" />;
};
let injected = false;
const ConversionPanel = ({ ui }) => {
  useEffect(() => {
    if (injected) return;
    if (ui.cy === undefined) {
      console.log("cy is undefined");
    } else {
      console.log("whorray got there");
      injected = true;
    }
  });

  return (
    <>
      <CyElm ui={ui} />
    </>
  );
};

export default ConversionPanel;
