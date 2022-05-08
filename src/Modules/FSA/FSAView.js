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
import { NFAtoREComponent } from "../Conversion";

const simulationOptions = [
  steppingStrategies.STEP_BY_STATE,
  steppingStrategies.STEP_WITH_CLOSURE,
  steppingStrategies.RANDOM,
];

function FSAView({ model, updateModel }) {
  const stFastRunChecked = useState(false);
  const [, forceRender] = useState({});
  const [NFAtoDFAModel, setNFAtoDFAModel] = useState(null);
  const [NFAtoREModel, setNFAtoREModel] = useState(null);

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
      setNFAtoDFAModel(NFAtoDFAModel);
      setWhatToShowRightPanel(1);
    });

    conversionBus.on(eventTypes.NFAtoRE, (NFAtoREModel) => {
      console.log("FSAView recived conversion model ", NFAtoREModel);
      setNFAtoREModel(NFAtoREModel);
      setWhatToShowRightPanel(2);
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
            configs={simulation.current.configs}
            onStepAll={hanldeStepAll}
            onReset={handleResetSimulation}
          />
        );

      case 1:
        return <NFAtoDFAComponent model={NFAtoDFAModel} />;

      case 2:
        return (
          <div>
            <label>The resulting Regular Expression</label>
            <NFAtoREComponent model={NFAtoREModel} />
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

      <div style={{ display: "flex" }}>
        <FSAComponent cyref={cy} model={model} updateModel={updateModel} />

        {whatToShowRightPanel !== null ? (
          <RightPanel setShowPanel={() => setWhatToShowRightPanel(null)}>
            {rightPanelContent()}
          </RightPanel>
        ) : null}
      </div>
    </>
  );
}

export default FSAView;
