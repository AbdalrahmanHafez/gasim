import { useEffect, useState, useContext } from "react";
import { StoreContext } from "../Store.js";

const $ = window.jQuery;

const SimCard = ({ id, config, tabIdx }) => {
  const handleStep = () => {
    console.log("handleStep");
    config.tick();
  };
  // const formatPath = (configPath) => configPath.join("->");

  // TODO: Dynamic sim
  return (
    <div
      className={
        "simCard " +
        (config.winstate ? "won" : config.winstate === undefined ? "" : "lost")
      }
    >
      <div className="simCardHeader">state: {config.stateId}</div>
      <div className="simCardProgress">
        {config.strDone}
        <strong>{config.strRem}</strong>
      </div>
      {tabIdx === 4 && (
        <div className="simCardProgress">{config.stack}</div>
        
      )}
      {/* {formatPath(config.path)} */}
    </div>
  );
};

export default function SimPanel({ tabIdx, ui }) {
  const getCy = () => ui.getCy();
  const getConfigs = () => ui.getConfigs();
  console.log("[SimPanel] Rendered");

  useEffect(() => {
    console.log("[SimPanel] useEffect");
  }, []);

  const handleBtnStepAll = () => {
    ui.actionSimulationStepAll();
  };
  const handleBtnReset = () => {
    ui.actionSimulationReset();
  };
  const handleBtnPanelClose = () => {
    ui.clearHighlighted();
    ui.helpers.setShowSim(false);
  };
  return (
    <div id="simContainer">
      Simulation Panel
      <button id={"btnCloseSim"} onClick={handleBtnPanelClose}>
        &#10005;
      </button>
      <br />
      <button id="testStepAll" onClick={handleBtnStepAll} className="ui-button">
        Step all
      </button>
      <button onClick={handleBtnReset} className="ui-button">
        Reset
      </button>
      {getConfigs().map((config, index) => (
        <SimCard key={index} id={index} config={config} tabIdx={tabIdx} />
      ))}
      {/* <SimCard id={1} view={view} handleStep={handleStep} /> */}
    </div>
  );
}
