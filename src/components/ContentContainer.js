import React, { useContext, useEffect, useState } from "react";
import SimPanel from "./SimPanel";
import { StoreContext } from "../Store.js";
import UI from "../classes/UI";
import { Menu, Dropdown, Checkbox } from "antd";
import { DownOutlined } from "@ant-design/icons";
import steppingStrategies from "../enums/steppingStrategies";
import tabTypes from "../enums/tabTypes";
import InputByFormalDefinition from "./InputByFormalDefinition";
import ConversionPanel from "../components/ConversionPanel";
import { Set, is } from "immutable";
import {
  getNodeClosure,
  verifyAtLeastFinalState,
  verifyInitalStateExists,
} from "../Helpers/hlpGraph";
import GrammarView from "./GrammarView";
import { grammarExamples, machineExamples } from "../Helpers/Constatns";
import GrammarConverter from "./GrammarConverter";
import REView from "./REView";
import axios from "axios";
const $ = window.jQuery;

const log = (msg) => console.log(`[Content Container] ${msg}`);
const map_ttype_to_strategy = (ttype) => {
  if (ttype === tabTypes.FA || ttype === tabTypes.PDA)
    return Object.keys(steppingStrategies);
  else if (ttype === tabTypes.TM) {
    return Object.keys(steppingStrategies).filter(
      (k) => k !== "STEP_WITH_CLOSURE"
    );
  } else if (ttype === tabTypes.IFD) {
    return Object.keys(steppingStrategies);
  } else {
    return [];
  }
};
const ContentContainer = ({ tabIdx, tabInfo, setTabInfo }) => {
  log("Render");
  const [, forceRender] = useState({});
  const [fake, setFake] = useState(false);

  const CY_ID = `cy-${tabIdx}`;
  const { tabType, showConversion } = tabInfo;

  const [ui, setui] = useState(new UI({ ...tabInfo, tabIdx }));
  const [enableFastrun, setEnableFastrun] = useState(false);

  const [showSim, setShowSim] = useState(false);

  const helpers = { forceRender, setShowSim };
  ui.helpers = helpers;

  useEffect(() => {
    const { elm1, elm2, elm3, elmPDA, elmTM, elmTM2, elmTM3, elm8, empty } =
      machineExamples;

    if (tabIdx === 0) ui.injectMachineCy(CY_ID, elm1);
    else if (tabIdx === 1) ui.injectMachineCy(CY_ID, elm2);
    else if (tabIdx === 2) ui.injectMachineCy(CY_ID, elm3);
    else if (tabIdx === 3) ui.injectMachineCy(CY_ID, elmPDA);
    else if (tabIdx === 4) ui.injectMachineCy(CY_ID, elmTM);
    else if (tabIdx === 5) ui.injectMachineCy(CY_ID, elmTM2);
    else if (tabIdx === 6) ui.injectMachineCy(CY_ID, elmTM3);
    else if (tabIdx === 8) ui.injectMachineCy(CY_ID, elm8);
    else {
      console.log("no cy injections for this tab");
    }

    // TODO: Dynamic sim, for given tab Type
    // inject cy with empty elm
  }, [ui]);

  const showIFD = tabType === tabTypes.IFD;

  const SimulateDropDown = () => {
    const st_menue_items = map_ttype_to_strategy(tabType).map((key, idx) => (
      <Menu.Item key={idx}>
        <a
          href="#"
          onClick={() => {
            ui.handleStartSimulation(steppingStrategies[key]);
          }}
        >
          {steppingStrategies[key]}
        </a>
      </Menu.Item>
    ));
    const simulationMenu = <Menu>{st_menue_items}</Menu>;
    const Anchor = (
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        {"Simulate  "}
        <DownOutlined />
      </a>
    );

    // const btnHandler = map_ttype_to_simulate_btn_handler(tabType);
    // TODO: move the component Simulation Button to each and every needed sub component ex: in the Grammar
    const Btn = (
      <a
        className="ant-dropdown-link"
        onClick={(e) => {
          e.preventDefault();
          console.log("click");
        }}
      >
        {"Simulate  "}
      </a>
    );
    return (
      <div id="btnSimulate">
        <Dropdown overlay={simulationMenu}>
          {st_menue_items.length === 0 ? Btn : Anchor}
        </Dropdown>
      </div>
    );
  };

  if (tabIdx === 10) {
    return <GrammarConverter ui={ui} />;
  }
  if (tabType === tabTypes.GR) {
    return (
      <>
        <SimulateDropDown />
        <GrammarView ui={ui} grammer={grammarExamples.g1} />
      </>
    );
  }

  if (tabType === tabTypes.RE) return <REView ui={ui} />;

  return (
    <>
      {!showIFD && <SimulateDropDown />}

      <div id="ckbFastrun">
        <Checkbox
          id="ckbFastrun"
          checked={enableFastrun}
          onChange={(e) => setEnableFastrun(e.target.checked)}
        >
          FastRun
        </Checkbox>
      </div>

      <button
        onClick={() => {
          console.log("Clicked converting button");
          const cy = ui.getCy();

          if (!verifyInitalStateExists(cy) || !verifyAtLeastFinalState(cy))
            return;

          const nodes = cy.nodes().map((n) => ({
            id: n.data("id"),
            inital: n.data("inital"),
            final: n.data("final"),
          }));
          const edges = cy.edges().map((e) => ({
            source: e.data("source"),
            target: e.data("target"),
            label: e.data("label") === "ε" ? "" : e.data("label"),
          }));
          const graphData = { nodes, edges };
          const graphDataStr = JSON.stringify(graphData);
          // console.log(graphDataStr);

          axios
            .post(
              `http://localhost:5050/js`,
              `code=edu.duke.cs.jflap.JFLAP.FSAtoRE('${encodeURIComponent(
                graphDataStr
              )}');`
            )
            .then((res) => {
              console.log("regex is ", res.data);
            });
        }}
      >
        Convert NFA to RE (TODO remov)
      </button>

      <div style={{ display: "flex" }}>
        {showIFD && (
          <div style={{ flexGrow: 1, marginLeft: 10 }}>
            <InputByFormalDefinition
              ui={ui}
              tabInfo={tabInfo}
              setTabInfo={setTabInfo}
            />
          </div>
        )}

        {!showIFD && <div id={CY_ID} className="cy" />}

        {showConversion && (
          <ConversionPanel
            tabInfo={tabInfo}
            ui={ui}
            tabType={tabType}
            tabIdx={tabIdx}
          />
        )}

        {/* TODO: better logic for showing which one,  for example 
        can'y show both panels simultanously */}

        {showSim && (
          <SimPanel
            isFastrun={enableFastrun}
            tabIdx={tabIdx}
            ui={ui}
            tabType={tabInfo.tabType}
            tabInfo={tabInfo}
          />
        )}
      </div>
    </>
  );
};

export default ContentContainer;
