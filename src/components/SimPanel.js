import { useEffect, useState, useContext } from "react";
import { StoreContext } from "../Store.js";

const $ = window.jQuery;

const SimCard = ({ id, config }) => {
  const [, forceRender] = useState({});
  const handleStep = () => {
    console.log("handleStep");
    config.tick();
  };
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
    </div>
  );
};

export default function SimPanel({
  tabIdx,
  configs,
  setconfigs,
  cyinst,
  setinfo,
}) {
  console.log("[SimPanel] Rendered");

  useEffect(() => {
    console.log("[SimPanel] useEffect");
  }, []);

  const handleStepAll = () => {
    console.log("handleStepAll");
    // the tick advances and colors the nodes and edges
    cyinst.nodes().classes([]);
    cyinst.edges().classes([]);

    // Replace current config with new config from each config tick function
    setconfigs((oldConfigs) =>
      oldConfigs.flatMap((config) => config.tick()).filter(Boolean)
    );
  };
  const handleBtnPanelClose = () => {
    setinfo((info) => {
      console.log("close button info ");
      console.log(info);
      return { ...info, shown: false };
    });
    setTimeout(() => {
      cyinst.fit(); // TODO: WTF is this
    }, 500);
  };
  return (
    <div id="simContainer">
      Simulation Panel
      <button id={"btnCloseSim"} onClick={handleBtnPanelClose}>
        &#10005;
      </button>
      <button onClick={handleStepAll} className="ui-button">
        Step all
      </button>
      {configs.map((config, index) => (
        <SimCard key={index} id={index} config={config} />
      ))}
      {/* <SimCard id={1} view={view} handleStep={handleStep} /> */}
    </div>
  );
}
