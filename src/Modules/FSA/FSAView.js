import React, { useState, useRef } from "react";
import FSAComponent from "./FSAComponent";
import { FastRunCheckBox } from "../../components/FastRun";
import steppingStrategies from "../../enums/steppingStrategies";
import { SimulateDropDown } from "../../components/Simulation";
import FSASimulation from "./FSASimulation";
import RightPanel from "../../components/RightPanel";
import SimPanel from "./SimPanel";

import {
  verifyInitalStateExists,
  clearHighlighted,
  highlightConfigs,
} from "../../utils";

const simulationOptions = [
  steppingStrategies.STEP_BY_STATE,
  steppingStrategies.STEP_WITH_CLOSURE,
  steppingStrategies.RANDOM,
];

function FSAView({ model }) {
  const stFastRunChecked = useState(false);
  const [showSim, setShowSim] = useState(false);
  const [, forceRender] = useState({});

  const cy = useRef(null);
  const simulation = useRef(null);

  const getCy = () => cy.current;

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

      setShowSim(true);
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

  return (
    <>
      <FastRunCheckBox stChecked={stFastRunChecked} />
      <SimulateDropDown options={simulationOptions} onClick={handleSimulate} />

      <div style={{ display: "flex" }}>
        <FSAComponent cyref={cy} model={model} />

        {showSim && (
          <RightPanel setShowPanel={setShowSim}>
            <SimPanel
              isFastRun={stFastRunChecked[0]}
              configs={simulation.current.configs}
              onStepAll={hanldeStepAll}
              onReset={handleResetSimulation}
            />
          </RightPanel>
        )}
      </div>
    </>
  );
}

export default FSAView;
