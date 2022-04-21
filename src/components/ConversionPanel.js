import React, { useEffect, useState } from "react";
import tabTypes from "../enums/tabTypes";

const log = (msg) => console.log(`[ConversionPanel] ${msg}`);

export default function ConversionPanel({ tabInfo, ui, tabType, tabIdx }) {
  log("render");
  const CY_ID = `cy-cnv-${tabIdx}`;
  const [, forcerender] = useState(null);

  const { conversionType } = tabInfo;

  const handleBtnPanelClose = () => {
    ui.helpers.setShowSim(false);
  };

  useEffect(() => {
    log("useEffect");

    console.log("in conversion panel", ui.cy);

    const cy = ui.injectConversionCy(CY_ID);
    const srcCy = ui.cy;
    ui.addConversion(srcCy, cy, tabType, conversionType);
  }, [ui]);

  return (
    <div id="conversionPanel">
      Conversion Panel
      <button id="btnCloseSim" onClick={handleBtnPanelClose}>
        &#10005;
      </button>
      <div id={CY_ID} className="cy" />
    </div>
  );
}
