import React, { useState, useRef, useEffect } from "react";
import FSAComponent from "./FSAComponent";
import { FastRunCheckBox } from "../../components/FastRun";
import steppingStrategies from "../../enums/steppingStrategies";
import { SimulateDropDown } from "../../components/Simulation";
import FSASimulation from "./FSASimulation";
import RightPanel from "../../components/RightPanel";
import SimPanel from "./SimPanel";
import { clearHighlighted, highlightConfigs } from "../../utils";
import { conversionBus, eventTypes } from "../../Events";
import NFAtoDFAComponent from "../Conversion/NFAtoDFAComponent";
import { FSAtoREComponent } from "../Conversion";
import ExportButton from "../../components/ExportButton";
import tabTypes from "../../enums/tabTypes";
import FSAModel from "./FSAModel";
import { REModel } from "../RE";

import { Typography } from "antd";
import { InfoCircleOutlined, InfoOutlined } from "@ant-design/icons";
import SimplePopup from "../../components/InformationPopups/SimplePopup";

const { Text } = Typography;

const simulationOptions = [
  steppingStrategies.STEP_BY_STATE,
  steppingStrategies.STEP_WITH_CLOSURE,
  steppingStrategies.RANDOM,
];

function FSAView({ model, updateModel }) {
  const stFastRunChecked = useState(false);
  const [, forceRender] = useState({});
  const [NFAtoDFAModel, setNFAtoDFAModel] = useState(null);
  const [FSAtoREModel, setFSAtoREModel] = useState(null);

  // const showNFAtoDFA = Boolean(NFAtoDFAModel);
  // const [showSim, setShowSim] = useState(false);
  const [whatToShowRightPanel, setWhatToShowRightPanel] = useState(null);

  const cy = useRef(null);
  const simulation = useRef(null);

  const getCy = () => cy.current;

  useEffect(() => {
    // Conversion event from menu bar
    conversionBus.on(eventTypes.NFAtoDFA, (NFAtoDFAModel) => {
      console.log("FSAView recived conversion model ", NFAtoDFAModel);
      try {
        NFAtoDFAModel.checkValid();
        setNFAtoDFAModel(NFAtoDFAModel);
        setWhatToShowRightPanel(1);
      } catch (error) {
        alert(error);
      }
    });

    conversionBus.on(eventTypes.FSAtoRE, (FSAtoREModel) => {
      console.log("FSAView recived conversion model ", FSAtoREModel);
      if (FSAtoREModel.alertVerify()) {
        setFSAtoREModel(FSAtoREModel);
        setWhatToShowRightPanel(2);
      }
    });
  }, []);

  const handleSimulate = (choiceStepping) => {
    console.log("clicked start simulation FSA");
    console.log("choosen", choiceStepping);

    // const userInputString = "abc";
    const userInputString = prompt("Enter input string");

    try {
      simulation.current = new FSASimulation(
        cy.current,
        userInputString,
        choiceStepping
      );

      setWhatToShowRightPanel(0);
    } catch (error) {
      alert(error);
      return;
    }
  };

  const hanldeStepAll = () => {
    if (cy.current !== getCy()) {
      throw new Error("cy is not the same as the refrence");
    }

    clearHighlighted(cy.current);

    simulation.current.actionStepAll();

    highlightConfigs(cy.current, simulation.current.configs);

    forceRender({});
  };

  const handleResetSimulation = () => {
    if (cy.current !== getCy()) {
      throw new Error("cy is not the same as the refrence");
    }

    clearHighlighted(cy.current);

    simulation.current = new FSASimulation(
      cy.current,
      simulation.current.inputString,
      simulation.current.steppingStrategy
    );

    highlightConfigs(cy.current, simulation.current.configs);
    forceRender({});
  };

  // TODO: when the right side panel opens excute a fit command, beacuse resize event fit automatically i disabled it

  function rightPanelContent() {
    switch (whatToShowRightPanel) {
      case 0:
        return (
          <SimPanel
            isFastRun={stFastRunChecked[0]}
            simulation={simulation.current}
            onStepAll={hanldeStepAll}
            onReset={handleResetSimulation}
          />
        );

      case 1:
        return (
          <div style={{ height: "-webkit-fill-available" }}>
            <ExportButton
              tabObj={{
                title: "Result NFAtoDFA",
                tabType: tabTypes.FA,
              }}
              modelEvalFn={() => new FSAModel(NFAtoDFAModel.exportResult)}
            />

            <NFAtoDFAComponent model={NFAtoDFAModel} />
          </div>
        );

      case 2:
        return (
          <div style={{ height: "-webkit-fill-available" }}>
            <label>The resulting Regular Expression</label>
            <ExportButton
              tabObj={{
                title: "Result NFAtoRE",
                tabType: tabTypes.RE,
              }}
              modelEvalFn={() => new REModel(FSAtoREModel.exportResult)}
            />
            <FSAtoREComponent model={FSAtoREModel} />
          </div>
        );

      default:
        throw new Error("unknown right panel content");
    }
    // const options = [
    //   <SimPanel
    //     isFastRun={stFastRunChecked[0]}
    //     configs={simulation.current.configs}
    //     onStepAll={hanldeStepAll}
    //     onReset={handleResetSimulation}
    //   />,
    //   <NFAtoDFAComponent model={NFAtoDFAModel} />,
    // ];
    // return options[whatToShowRightPanel];
  }

  return (
    <>
      <FastRunCheckBox stChecked={stFastRunChecked} />
      <SimulateDropDown options={simulationOptions} onClick={handleSimulate} />
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            // background: "green",
          }}
        >
          <SimplePopup
            options={{
              steps: [
                {
                  title: "New Node",
                  intro: "Double click on the background to create a node.",
                },
                {
                  title: "Connect Nodes",
                  intro:
                    "Enable transition -top left-, then drag between nodes to create a new edge.",
                },
                {
                  title: "Context Menu",
                  intro:
                    "Right click to explore more optios, such as setting an inital/final node.",
                },
                {
                  title: "Rename",
                  intro: "To Rename double click an Edge or Node.",
                },
              ],
            }}
          />
        </div>

        <div style={{ display: "flex" }} className="bg-red-300 h-full">
          <FSAComponent cyref={cy} model={model} updateModel={updateModel} />

          {whatToShowRightPanel !== null ? (
            <RightPanel setShowPanel={() => setWhatToShowRightPanel(null)}>
              {rightPanelContent()}
            </RightPanel>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default FSAView;
