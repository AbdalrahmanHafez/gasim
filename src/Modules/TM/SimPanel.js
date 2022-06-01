import React from "react";
import useFastrun from "../../Hooks/useFastrun.js";
import { Slider, Space, Divider } from "antd";
import {
  CaretRightOutlined,
  PauseOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import tabTypes from "../../enums/tabTypes.js";

const DEFAULT_PLAY_SPEED = 20;

const TM_Highlight_Head = (tape) => {
  let rendered = [];
  const keys = Object.keys(tape.elements).map(Number);
  const extendedChars = 4;
  const start = (keys[0] || 0) - extendedChars;
  const end = (keys[keys.length - 1] || 0) + extendedChars;
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
      {config.tapes.map((tape, idx) => (
        <div key={idx} className="simCardProgress">
          {TM_Highlight_Head(tape)}
        </div>
      ))}
    </div>
  );
};

function SimPanel({ isFastRun, simulation, onStepAll, onReset }) {
  const [running, toggleRunning, setRunInterval] = useFastrun(
    onStepAll,
    DEFAULT_PLAY_SPEED
  );

  console.log("[SimPanel] Rendered");

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
