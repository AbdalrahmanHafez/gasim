import React, { useRef, useEffect, useState } from "react";
import { Button, Input } from "antd";
import { machineExamples } from "../../Helpers/Constatns";
import { FSAModel } from "../FSA";
import { REtoNFA, REtoNFAComponent } from "../Conversion";
import { conversionBus, eventTypes } from "../../Events";
import REModel from "./REModel";
import ExportButton from "../../components/ExportButton";
import tabTypes from "../../enums/tabTypes";

// const CY_ID = "RE-to-NFA-CY";

// MAYBE: missing ! empty string inputs supported by jflap
function REView({ model, updateModel }) {
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
      <Button onClick={handleBtnConvert} style={{ marginBottom: "0.2em" }}>
        Convert RE to NFA
      </Button>

      <Input
        value={input}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Input a regular expression"
      />

      {/* <FSAComponent cyref={cy} model={CreatedFSAModel} /> */}

      {REtoNFAModel !== null && (
        <div>
          <ExportButton
            tabObj={{ title: "Result REtoNFA", tabType: tabTypes.FA }}
            modelEvalFn={() => new FSAModel(REtoNFAModel.exportResult)}
          />
          <REtoNFAComponent model={REtoNFAModel} />
        </div>
      )}
    </>
  );
}

export default REView;
