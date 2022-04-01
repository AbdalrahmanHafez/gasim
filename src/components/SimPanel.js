import { useEffect, useState, useContext } from "react";
import { StoreContext } from "../Store.js";

const $ = window.jQuery;

const SimCard = ({ id, config }) => {
  const [, forceRender] = useState({});
  const handleStep = () => {
    console.log("handleStep");
    config.tick();
  };
  const formatPath = (configPath) => configPath.join("->");

  return (
    <div
      className={
        "simCard " +
        (config.winstate ? "won" : config.winstate === undefined ? "" : "lost")
      }
    >
      <div className="simCardHeader">state: {config.strCurState}</div>
      <div className="simCardProgress">
        {config.strDone}
        <strong>{config.strRem}</strong>
      </div>
      {formatPath(config.path)}
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
    console.log("handleStepAll");
    // the tick advances and colors the nodes and edges
    getCy().nodes().classes([]);
    getCy().edges().classes([]);

    // Replace current config with new config from each config tick function
    // setconfigs((oldConfigs) =>
    //   oldConfigs.flatMap((config) => config.tick()).filter(Boolean)
    // );
  };
  const handleBtnReset = () => {
    getCy().nodes().classes([]);
    getCy().edges().classes([]);
    // const inputString = info.inputString;
    // handleStartSimulation(inputString);
  };
  const handleBtnPanelClose = () => {
    getCy().nodes().classes([]);
    getCy().edges().classes([]);
    // setinfo((info) => {
    //   console.log("close button info ");
    //   console.log(info);
    //   return { ...info, shown: false };
    // });
    ui.helpers.setShowSim(false);
  };
  return (
    <div id="simContainer">
      Simulation Panel
      <button id={"btnCloseSim"} onClick={handleBtnPanelClose}>
        &#10005;
      </button>
      <br />
      <button onClick={handleBtnStepAll} className="ui-button">
        Step all
      </button>
      <button onClick={handleBtnReset} className="ui-button">
        Reset
      </button>
      {getConfigs().map((config, index) => (
        <SimCard key={index} id={index} config={config} />
      ))}
      {/* <SimCard id={1} view={view} handleStep={handleStep} /> */}
    </div>
  );
}
