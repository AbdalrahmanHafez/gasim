import React, { useRef, useEffect, useState } from "react";
import { Button, Input } from "antd";
import { machineExamples } from "../../Helpers/Constatns";
import { FSAModel } from "../FSA";
import { REtoNFA, REtoNFAComponent } from "../Conversion";
import { conversionBus, eventTypes } from "../../Events";
import REModel from "./REModel";
import ExportButton from "../../components/ExportButton";
import tabTypes from "../../enums/tabTypes";
import useTracking from "../../Hooks/useTracking";

// const CY_ID = "RE-to-NFA-CY";

// MAYBE: missing ! empty string inputs supported by jflap
function REView({ model, updateModel }) {
  const { trackInput } = useTracking();
  const [input, setInput] = useState(model?.inputRegex || "");

  const [REtoNFAModel, setREtoNFAModel] = useState(null);

  // const cy = useRef(null);
  // const getCy = () => cy.current;

  // const [CreatedFSAModel, setCreatedFSAModel] = useState(null);

  useEffect(() => {
    // Conversion event from menu bar
    conversionBus.on(eventTypes.REtoNFA, (REtoNFAModel) => {
      console.log("REView recived conversion model ", REtoNFAModel);
      // Verify inputs
      const input = REtoNFAModel.REModel.inputRegex;

      trackInput({ regex: input });

      if (typeof input !== "string" && input.trim() === "") {
        alert("Please enter a none empty regular expression");
        return;
      }

      setREtoNFAModel(REtoNFAModel);
    });

    // Debug auto click on Convert RE to NFA
    // conversionBus.dispatch(eventTypes.REtoNFA, new REtoNFA(new REModel(input)));
  }, []);

  const handleBtnConvert = () => {
    conversionBus.dispatch(eventTypes.REtoNFA, new REtoNFA(new REModel(input)));
  };

  function setInputValue(value) {
    setInput(value);
    updateModel(new REModel(value));
  }

  return (
    <>
      <h4 className="m-1">Regular Expression</h4>
      <div className="m-1 flex flex-1 gap-1">
        <Input
          value={input}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Input a regular expression"
        />

        <Button onClick={handleBtnConvert}>Convert to NFA</Button>
      </div>
      <div className="m-1 p-2 border rounded-md">
        <span>
          <b>+</b> Is the OR symbol.
        </span>
        <br />
        <span>
          <b>!</b> Represents Epsilon symbol ε, example usage: a(b+!)
        </span>
        <br />
        <span>
          <b>*</b> Kleene star, zero or more of expression, ex: a*
        </span>
      </div>
      {/* <FSAComponent cyref={cy} model={CreatedFSAModel} /> */}

      {REtoNFAModel !== null && (
        <div className="m-1 flex flex-col items-end ">
          <div style={{ height: "30rem", width: "100%" }}>
            <REtoNFAComponent model={REtoNFAModel} />
          </div>

          <ExportButton
            className="mt-1"
            tabObj={{ title: "Result REtoNFA", tabType: tabTypes.FA }}
            modelEvalFn={() => new FSAModel(REtoNFAModel.exportResult)}
          />
        </div>
      )}
    </>
  );
}

export default REView;
