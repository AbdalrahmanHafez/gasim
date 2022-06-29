import React, { useEffect, useState, useRef } from "react";
import useFastrun from "../../Hooks/useFastrun.js";
import { Slider, Space, Divider } from "antd";
import {
  CaretRightOutlined,
  PauseOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import tabTypes from "../../enums/tabTypes.js";
import {
  clearHighlighted,
  getNodeFromId,
  highlightConfigs,
} from "../../utils/Graph.js";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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
    </div>
  );
};

function SimPanel({ cyref, isFastRun, simulation, onStepAll, onReset }) {
  const [running, toggleRunning, setRunInterval] = useFastrun(
    onStepAll,
    DEFAULT_PLAY_SPEED
  );

  const [parent] = useAutoAnimate(/* optional config */);

  useEffect(() => {
    // intial heighlight of the first config
    highlightConfigs(cyref.current, simulation.configs);
    return () => {
      clearHighlighted(cyref.current);
    };
  }, []);

  // const [items, setItems] = useState([0, 1]);
  // const add = () => setItems([...items, items.length]);
  // return (
  //   <>
  //     <ul ref={parent}>
  //       {items.map((item) => (
  //         <span key={item}>{item}</span>
  //       ))}
  //     </ul>
  //     <ul ref={parent}>
  //       {items.map((item) => (
  //         <span key={item}>{item}</span>
  //       ))}
  //     </ul>
  //     <div ref={parent}>
  //       <strong className="dropdown-label" onClick={add}>
  //         Click me to open!
  //       </strong>
  //       {items.length % 2 === 0 && (
  //         <p className="dropdown-content">Lorum ipsum...</p>
  //       )}
  //     </div>
  //     <button onClick={add}>Add number</button>
  //   </>
  // );

  console.log("[SimPanel] Rendered");

  return (
    <>
      Simulation Panel
      <br />
      <div style={{ display: "flex", marginTop: "0.8em" }} ref={parent}>
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
      <div
        className="mt-4"
        style={{ height: "82vh", overflowY: "scroll" }}
        ref={parent}
      >
        {simulation.configs.map((config, index) => (
          <SimCard key={index} simulation={simulation} config={config} />
        ))}
      </div>
    </>
  );
}

export default SimPanel;
