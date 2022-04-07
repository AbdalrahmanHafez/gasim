import { useEffect, useState, useContext } from "react";
import tabTypes from "../enums/tabTypes.js";
import { StoreContext } from "../Store.js";

const $ = window.jQuery;

const TM_Highlight_Head = (tape) => {
  let rendered = [];
  console.log(tape.elements);
  const keys = Object.keys(tape.elements).map(Number);
  const extendedChars = 4;
  const start = (keys[0] || 0) - extendedChars;
  const end = (keys[keys.length - 1] || 0) + extendedChars;
  console.log("start: ", start);
  console.log("end: ", end);
  console.log("-");
  for (let i = start; i <= end; i++) {
    rendered.push(
      <span
        key={i}
        style={
          tape.head === i
            ? {
                fontWeight: "bold",
                backgroundColor: "lightseagreen",
              }
            : {}
        }
      >
        {tape.elements[i] === undefined ? "▢" : tape.elements[i]}
      </span>
    );
  }

  return rendered;
};
const SimCard = ({ id, config, tabIdx, tabType }) => {
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
      {(tabType === tabTypes.NFA || tabType === tabType.PDA) && (
        <div className="simCardProgress">
          {config.strDone}
          <strong>{config.strRem}</strong>
        </div>
      )}
      {tabType === tabTypes.PDA && (
        <div className="simCardProgress">{config.stack}</div>
      )}
      {tabType === tabTypes.TM &&
        config.tapes.map((tape, idx) => (
          <div key={idx} className="simCardProgress">
            {TM_Highlight_Head(tape)}
          </div>
        ))}
      {/* {formatPath(config.path)} */}
    </div>
  );
};

export default function SimPanel({ tabIdx, ui, tabType }) {
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
        <SimCard
          key={index}
          id={index}
          config={config}
          tabIdx={tabIdx}
          tabType={tabType}
        />
      ))}
      {/* <SimCard id={1} view={view} handleStep={handleStep} /> */}
    </div>
  );
}
