import React, { useEffect } from "react";
import useFastrun from "../../Hooks/useFastrun.js";
import { Slider, Space, Divider } from "antd";
import {
  CaretRightOutlined,
  PauseOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import tabTypes from "../../enums/tabTypes.js";
import { clearHighlighted, highlightConfigs } from "../../utils/Graph.js";

const DEFAULT_PLAY_SPEED = 20;

const SimCard = ({ config, simulation }) => {
  return (
    <div
      className={
        "simCard " +
        (config.winstate ? "won" : config.winstate === undefined ? "" : "lost")
      }
    >
      <div className="simCardHeader">
        state: {simulation.getStateDisplayName(config.stateId)}
      </div>
      <div className="simCardProgress">
        {config.strDone}
        <strong>{config.strRem}</strong>
      </div>
      <div className="simCardProgress">{config.stack}</div>
    </div>
  );
};

function SimPanel({ cyref, isFastRun, simulation, onStepAll, onReset }) {
  const [running, toggleRunning, setRunInterval] = useFastrun(
    onStepAll,
    DEFAULT_PLAY_SPEED
  );

  console.log("[SimPanel] Rendered");

  useEffect(() => {
    // intial heighlight of the first config
    highlightConfigs(cyref.current, simulation.configs);
    return () => {
      clearHighlighted(cyref.current);
    };
  }, []);

  return (
    <>
      Simulation Panel
      <br />
      <div style={{ display: "flex", marginTop: "0.8em" }}>
        {isFastRun ? (
          <>
            <button onClick={toggleRunning} className="ui-button icon-button">
              {running ? <PauseOutlined /> : <CaretRightOutlined />}
            </button>
            <Slider
              style={{ flexGrow: 1 }}
              min={1}
              max={100}
              defaultValue={DEFAULT_PLAY_SPEED}
              onChange={setRunInterval}
            />
          </>
        ) : (
          <button id="testStepAll" onClick={onStepAll} className="ui-button">
            Step
          </button>
        )}
        <button onClick={onReset} className="ui-button icon-button">
          {/* Reset */}
          <UndoOutlined />
        </button>
      </div>
      <div className="mt-4" style={{ height: "82vh", overflowY: "scroll" }}>
        {simulation.configs.map((config, index) => (
          <SimCard key={index} config={config} simulation={simulation} />
        ))}
      </div>
    </>
  );
}

export default SimPanel;
