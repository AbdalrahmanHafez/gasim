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
import SimplePopup from "../../components/InformationPopups/SimplePopup";
import useTracking from "../../Hooks/useTracking";

const simulationOptions = [
  steppingStrategies.STEP_BY_STATE,
  steppingStrategies.RANDOM,
];

function TMView({ model }) {
  const { trackButtonClick } = useTracking();

  const stFastRunChecked = useState(false);
  const [showSim, setShowSim] = useState(false);
  const [, forceRender] = useState({});

  const cy = useRef(null);
  const simulation = useRef(null);

  const getCy = () => cy.current;

  const handleSimulate = (choiceStepping) => {
    trackButtonClick({ id: "SimulateTM", choiceStepping });

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
    trackButtonClick({ id: "SimulationStepAll" });

    if (cy.current !== getCy()) {
      throw new Error("cy is not the same as the refrence");
    }

    clearHighlighted(cy.current);

    simulation.current.actionStepAll();

    highlightConfigs(cy.current, simulation.current.configs);

    forceRender({});
  };

  const handleResetSimulation = () => {
    trackButtonClick({ id: "SimulationReset" });

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
                  title: "Label Definition",
                  intro: `<div>
                  ( a, b -> R ) Means:
                  <br/>
                  Reads 'a' and writes 'b' on the current tape.
                  <br/>
                  <br/>
                  R means it will move next to the right
                  <br/>
                  The third option can be one of (R,L,S), Right, Left, Stay.
                  </div>`,
                },
              ],
            }}
          />
        </div>

        <div style={{ display: "flex" }} className="bg-red-300 h-full">
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
      </div>
    </>
  );
}

export default TMView;
