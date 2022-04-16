import { useEffect, useState, useContext } from "react";
import tabTypes from "../enums/tabTypes.js";
import useFastrun from "../Hooks/useFastrun.js";
import { Slider, Space, Divider } from "antd";
import {
  CaretRightOutlined,
  PauseOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";

const $ = window.jQuery;

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
const SimCard = ({ id, config, tabIdx, tabInfo }) => {
  // const formatPath = (configPath) => configPath.join("->");
  const { tabType, simType: IFDSimType } = tabInfo;
  const simType = IFDSimType || tabType; // IFDSimType is only for IFD
  // TODO: Dynamic sim
  return (
    <div
      className={
        "simCard " +
        (config.winstate ? "won" : config.winstate === undefined ? "" : "lost")
      }
    >
      <div className="simCardHeader">state: {config.stateId}</div>
      {(simType === tabTypes.FA || simType === tabTypes.PDA) && (
        <div className="simCardProgress">
          {config.strDone}
          <strong>{config.strRem}</strong>
        </div>
      )}
      {simType === tabTypes.PDA && (
        <div className="simCardProgress">{config.stack}</div>
      )}
      {simType === tabTypes.TM &&
        config.tapes.map((tape, idx) => (
          <div key={idx} className="simCardProgress">
            {TM_Highlight_Head(tape)}
          </div>
        ))}
      {/* {formatPath(config.path)} */}
    </div>
  );
};

const DEFAULT_PLAY_SPEED = 20;
export default function SimPanel({ tabIdx, ui, tabInfo, isFastrun }) {
  const getCy = () => ui.getCy();
  const getConfigs = () => ui.getConfigs();

  const handleBtnStepAll = () => {
    ui.actionSimulationStepAll();
  };

  const [running, toggleRunning, setRunInterval] = useFastrun(
    handleBtnStepAll,
    DEFAULT_PLAY_SPEED
  );

  const handleBtnReset = () => {
    ui.actionSimulationReset();
  };
  const handleBtnPanelClose = () => {
    ui.clearHighlighted();
    ui.helpers.setShowSim(false);
  };

  console.log("[SimPanel] Rendered");

  useEffect(() => {
    console.log("[SimPanel] useEffect");
  }, []);

  return (
    <div id="simContainer">
      Simulation Panel
      <button id="btnCloseSim" onClick={handleBtnPanelClose}>
        &#10005;
      </button>
      <br />
      <div style={{ display: "flex" }}>
        {isFastrun ? (
          <>
            <button onClick={toggleRunning} className="ui-button">
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
          <button
            id="testStepAll"
            onClick={handleBtnStepAll}
            className="ui-button"
          >
            Step all
          </button>
        )}
        <button onClick={handleBtnReset} className="ui-button">
          {/* Reset */}
          <UndoOutlined />
        </button>
      </div>
      {getConfigs().map((config, index) => (
        <SimCard
          key={index}
          id={index}
          config={config}
          tabIdx={tabIdx}
          tabInfo={tabInfo}
        />
      ))}
    </div>
  );
}
