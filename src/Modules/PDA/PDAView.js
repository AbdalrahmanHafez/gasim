import React, { useState, useRef, useEffect } from "react";
import { FastRunCheckBox } from "../../components/FastRun";
import steppingStrategies from "../../enums/steppingStrategies";
import { SimulateDropDown } from "../../components/Simulation";
import PDAComponent from "./PDAComponent";
import PDASimulation from "./PDASimulation";
import RightPanel from "../../components/RightPanel";
import SimPanel from "./SimPanel";

import {
  verifyInitalStateExists,
  clearHighlighted,
  highlightConfigs,
} from "../../utils";
import { conversionBus, eventTypes } from "../../Events";
import { PDAtoGRComponent } from "../Conversion";
import ExportButton from "../../components/ExportButton";
import tabTypes from "../../enums/tabTypes";
import { GRModel } from "../GR";

const simulationOptions = [
  steppingStrategies.STEP_BY_STATE,
  steppingStrategies.STEP_WITH_CLOSURE,
  steppingStrategies.RANDOM,
];

function PDAView({ model, updateModel }) {
  const stFastRunChecked = useState(false);
  const [, forceRender] = useState({});

  const [idxToShow, setIdxToShow] = useState(null);
  const [PDAtoGRModel, setPDAtoGRModel] = useState(null);

  const cy = useRef(null);
  const simulation = useRef(null);

  const getCy = () => cy.current;

  useEffect(() => {
    // Conversion event from menu bar

    conversionBus.on(eventTypes.PDAtoGR, (PDAtoGRModel) => {
      console.log("PDAView recived conversion model ", PDAtoGRModel);
      // TODO: do checks first in another method HERE if ok then proced

      if (!PDAtoGRModel.checkValid()) return;

      setPDAtoGRModel(PDAtoGRModel);
      setIdxToShow(1);
    });
  }, []);

  const handleSimulate = (choiceStepping) => {
    console.log("clicked start simulation PDA");
    console.log("choosen", choiceStepping);

    // const userInputString = "abc";
    const userInputString = prompt("Enter input string");

    try {
      simulation.current = new PDASimulation(
        cy.current,
        userInputString,
        choiceStepping
      );

      setIdxToShow(0);
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

    simulation.current = new PDASimulation(
      cy.current,
      simulation.current.inputString,
      simulation.current.steppingStrategy
    );

    highlightConfigs(cy.current, simulation.current.configs);
    forceRender({});
  };

  function displaySideContent() {
    if (idxToShow === null) return null;
    if (idxToShow === 0)
      return (
        <SimPanel
          isFastRun={stFastRunChecked[0]}
          simulation={simulation.current}
          onStepAll={hanldeStepAll}
          onReset={handleResetSimulation}
        />
      );

    if (idxToShow === 1)
      return (
        <div>
          <ExportButton
            tabObj={{ title: "Result PDAtoGR", tabType: tabTypes.GR }}
            modelEvalFn={() => PDAtoGRModel.exportResult}
          />
          <PDAtoGRComponent model={PDAtoGRModel} />
        </div>
      );
  }

  return (
    <>
      <FastRunCheckBox stChecked={stFastRunChecked} />
      <SimulateDropDown options={simulationOptions} onClick={handleSimulate} />

      <div style={{ display: "flex" }} className="bg-red-300 h-full">
        <PDAComponent cyref={cy} model={model} updateModel={updateModel} />

        {idxToShow !== null && (
          <RightPanel setShowPanel={() => setIdxToShow(null)}>
            {displaySideContent()}
          </RightPanel>
        )}
      </div>
    </>
  );
}

export default PDAView;
