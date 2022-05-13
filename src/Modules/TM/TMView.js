import React, { useState, useRef } from "react";
import { FastRunCheckBox } from "../../components/FastRun";
import steppingStrategies from "../../enums/steppingStrategies";
import { SimulateDropDown } from "../../components/Simulation";
import TMComponent from "./TMComponent";
import TMSimulation from "./TMSimulation";
import RightPanel from "../../components/RightPanel";
import SimPanel from "./SimPanel";

import {
  verifyInitalStateExists,
  clearHighlighted,
  highlightConfigs,
} from "../../utils";

const simulationOptions = [
  steppingStrategies.STEP_BY_STATE,
  steppingStrategies.RANDOM,
];

function TMView({ model }) {
  const stFastRunChecked = useState(false);
  const [showSim, setShowSim] = useState(false);
  const [, forceRender] = useState({});

  const cy = useRef(null);
  const simulation = useRef(null);

  const getCy = () => cy.current;

  const handleSimulate = (choiceStepping) => {
    console.log("clicked start simulation TM");
    console.log("choosen", choiceStepping);

    // let tapesCount = +prompt("Enter number of tapes", 1);
    const tapesCount = model.tapesCount;

    const userInput = Array(tapesCount)
      .fill("")
      .map((_, idx) => prompt(`Enter input for tape ${idx + 1}`, ""));

    try {
      simulation.current = new TMSimulation(
        cy.current,
        userInput,
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

    simulation.current = new TMSimulation(
      cy.current,
      simulation.current.inputs,
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
        <TMComponent cyref={cy} model={model} />

        {showSim && (
          <RightPanel setShowPanel={setShowSim}>
            <SimPanel
              isFastRun={stFastRunChecked[0]}
              simulation={simulation.current}
              onStepAll={hanldeStepAll}
              onReset={handleResetSimulation}
            />
          </RightPanel>
        )}
      </div>
    </>
  );
}

export default TMView;
