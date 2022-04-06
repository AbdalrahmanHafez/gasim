import React, { useContext, useEffect, useState } from "react";
import SimPanel from "./SimPanel";
import { StoreContext } from "../Store.js";
import UI from "../classes/UI";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import steppingStrategy from "../enums/steppingStrategy";

const $ = window.jQuery;

const log = (msg) => console.log(`[Content Container] ${msg}`);
const ContentContainer = ({ tabIdx, info }) => {
  log("Render");
  const [, forceRender] = useState({});

  const { tabType } = info;

  const [ui, setui] = useState(new UI({ ...info, tabIdx }));

  const [showSim, setShowSim] = useState(false);

  const helpers = { forceRender, setShowSim };
  ui.helpers = helpers;

  useEffect(() => {
    const elm1 = {
      nodes: [
        {
          data: { id: "a", name: "Node A", inital: true, final: false },
          position: { x: 0, y: 0 },
          selected: true,
          locked: false,
        },
        {
          data: { id: "q4", name: "q4", inital: false, final: false },
        },
        {
          data: { id: "b", name: "B", inital: false, final: true },
          parent: "a",
          position: { x: 100, y: 100 },
          renderedPosition: { x: 100, y: 100 },
        },
        {
          data: { id: "c", name: "C", inital: false, final: false },
          parent: "a",
        },
        { data: { id: "d", name: "D", inital: false, final: true } },
        { data: { id: "q5", name: "q5", inital: false, final: false } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "a" } },
        { data: { id: "ba", source: "b", target: "a", label: "b" } },
        { data: { id: "ac", source: "a", target: "c", label: "c" } },
        { data: { id: "cd", source: "c", target: "d", label: "d" } },
        { data: { id: "aq4", source: "a", target: "q4", label: "a" } },
        { data: { id: "dq5", source: "d", target: "q5", label: "ε" } },
      ],
    };
    const elm2 = {
      nodes: [
        {
          data: { id: "a", name: "Node A", inital: true, final: false },
        },
        {
          data: { id: "f", name: "F", inital: false, final: false },
        },
        {
          data: { id: "w", name: "W", inital: false, final: true },
        },
        {
          data: { id: "g", name: "G", inital: false, final: false },
        },
        {
          data: { id: "h", name: "H", inital: false, final: true },
        },
        {
          data: { id: "b", name: "B", inital: false, final: false },
        },
        {
          data: { id: "c", name: "C", inital: false, final: false },
        },
        {
          data: { id: "d", name: "D", inital: false, final: false },
        },
        { data: { id: "e", name: "E", inital: false, final: true } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "a" } },
        { data: { id: "af", source: "a", target: "f", label: "ε" } },
        { data: { id: "fg", source: "f", target: "g", label: "a" } },
        { data: { id: "fw", source: "f", target: "w", label: "ε" } },
        { data: { id: "gh", source: "g", target: "h", label: "b" } },
        { data: { id: "bc", source: "b", target: "c", label: "ε" } },
        { data: { id: "cd", source: "c", target: "d", label: "ε" } },
        { data: { id: "db", source: "d", target: "b", label: "ε" } },
        { data: { id: "de", source: "d", target: "e", label: "b" } },
      ],
    };
    const elm3 = {
      nodes: [
        {
          data: { id: "a", name: "Node A", inital: true, final: false },
        },
        {
          data: { id: "b", name: "B", inital: false, final: false },
        },
        {
          data: { id: "c", name: "C", inital: false, final: false },
        },
        {
          data: { id: "d", name: "D", inital: false, final: false },
        },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "a" } },
        { data: { id: "bb", source: "b", target: "b", label: "ε" } },
        { data: { id: "bc", source: "b", target: "c", label: "ε" } },
        { data: { id: "cd", source: "c", target: "d", label: "b" } },
      ],
    };

    const elmPDA = {
      nodes: [
        {
          data: { id: "a", name: "Node A", inital: true, final: false },
        },
        {
          data: { id: "f", name: "F", inital: false, final: false },
        },
        {
          data: { id: "w", name: "W", inital: false, final: true },
        },
        {
          data: { id: "g", name: "G", inital: false, final: false },
        },
        {
          data: { id: "h", name: "H", inital: false, final: true },
        },
        {
          data: { id: "b", name: "B", inital: false, final: false },
        },
        {
          data: { id: "c", name: "C", inital: false, final: false },
        },
        {
          data: { id: "d", name: "D", inital: false, final: false },
        },
        { data: { id: "e", name: "E", inital: false, final: true } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "aZX" } },
        { data: { id: "af", source: "a", target: "f", label: "εεS" } },
        { data: { id: "fg", source: "f", target: "g", label: "aεε" } },
        { data: { id: "fw", source: "f", target: "w", label: "εSK" } },
        { data: { id: "gh", source: "g", target: "h", label: "bSε" } },
        { data: { id: "bc", source: "b", target: "c", label: "εεε" } },
        { data: { id: "cd", source: "c", target: "d", label: "εεε" } },
        { data: { id: "db", source: "d", target: "b", label: "εεε" } },
        { data: { id: "de", source: "d", target: "e", label: "bXε" } },
      ],
    };

    if (tabIdx === 0) ui.injectCy(elm1);
    if (tabIdx === 1) ui.injectCy(elm2);
    if (tabIdx === 2) ui.injectCy(elm3);
    if (tabIdx === 3) ui.injectCy(elmPDA);

    // TODO: Dynamic sim, for given tab Type
    // inject cy with empty elm
  }, [ui]);

  const menu = (
    <Menu>
      {Object.keys(steppingStrategy).map((key, idx) => (
        <Menu.Item key={idx}>
          <a
            href="#"
            onClick={() => {
              ui.handleStartSimulation(steppingStrategy[key]);
            }}
          >
            {steppingStrategy[key]}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      <div id="btnSimulate">
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            {"Simulate  "}
            <DownOutlined />
          </a>
        </Dropdown>
      </div>
      <button
        id="testButton"
        onClick={() => {
          console.log("[test btn] click");
          // ui.test();
          ui.handleStartSimulation(steppingStrategy.STEP_BY_STATE);
        }}
      >
        test
      </button>
      <div style={{ display: "flex" }}>
        <div id={`cy-${tabIdx}`} className="cy" />
        {showSim && <SimPanel tabIdx={tabIdx} ui={ui} tabType={info.tabType} />}
      </div>
    </>
  );
};

export default ContentContainer;
