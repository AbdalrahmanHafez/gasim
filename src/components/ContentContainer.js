import Button from "@mui/material/Button";
import React, { useContext, useEffect, useState } from "react";
import SimPanel from "./SimPanel";
import { StoreContext } from "../Store.js";
import UI from "../classes/UI";
const $ = window.jQuery;

const log = (msg) => console.log(`[Content Container] ${msg}`);
const ContentContainer = ({ tabIdx }) => {
  log("Render");
  const [store, setstore] = useContext(StoreContext);
  const [ui, setui] = useState(new UI(tabIdx));

  const info = store[tabIdx];
  const [showSim, setShowSim] = useState(false);

  const helpers = { setShowSim };
  ui.helpers = helpers;

  const setinfo = (something) => {
    const newInfo =
      typeof something === "function" ? something(info) : something;
    setstore((prev) => {
      const newstore = [...prev];
      newstore[tabIdx] = newInfo;
      return newstore;
    });
  };

  useEffect(() => {
    console.log("useEffect injection");
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

    ui.injectCy(elm1);
  }, [ui]);

  return (
    <>
      <Button
        id="btnSimulate"
        variant="outlined"
        onClick={ui.handleStartSimulation}
      >
        Simulate input
      </Button>
      <button
        onClick={() => {
          // callShow(true);
          console.log("click");
        }}
      >
        test
      </button>
      <div style={{ display: "flex" }}>
        <div id={`cy-${tabIdx}`} className="cy" />
        {showSim && <SimPanel tabIdx={tabIdx} ui={ui} />}
      </div>
    </>
  );
};

export default ContentContainer;
