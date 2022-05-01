import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";
import { machineExamples } from "../Helpers/Constatns";
import axios from "axios";
const CY_ID = "RE-to-NFA-CY";
// MAYBE: missing ! empty string inputs supported by jflap
function REView({ ui }) {
  const [input, setInput] = useState("");

  const dataStub = JSON.parse(
    '{"states":[{"id":2,"labels":[]},{"id":6,"labels":[]},{"id":7,"labels":[]},{"id":0,"labels":[]},{"id":4,"labels":[]},{"id":1,"labels":[]},{"id":5,"labels":[]},{"id":3,"labels":[]}],"finalStates":[{"id":1,"labels":[]}],"initialState":{"id":0,"labels":[]},"transitions":[{"myLabel":"b","from":{"id":4,"labels":[]},"to":{"id":5,"labels":[]}},{"myLabel":"","from":{"id":3,"labels":[]},"to":{"id":4,"labels":[]}},{"myLabel":"c","from":{"id":6,"labels":[]},"to":{"id":7,"labels":[]}},{"myLabel":"","from":{"id":0,"labels":[]},"to":{"id":2,"labels":[]}},{"myLabel":"","from":{"id":7,"labels":[]},"to":{"id":1,"labels":[]}},{"myLabel":"","from":{"id":5,"labels":[]},"to":{"id":6,"labels":[]}},{"myLabel":"a","from":{"id":2,"labels":[]},"to":{"id":3,"labels":[]}}]}'
  );

  const handleBtnConvert = () => {
    // Verify inputs
    if (typeof input !== "string" && input.trim() === "") {
      alert("Please enter a none empty regular expression");
      return;
    }

    console.log("Convert started");
    ui.injectMachineCy(CY_ID, machineExamples.empty);

    const cy = ui.getCy();

    axios
      .get(
        `http://localhost:5050/js?code=edu.duke.cs.jflap.JFLAP.REtoNFA('${input}')`
      )
      .then((res) => {
        // clear old graph
        cy.remove("node");
        cy.remove("edge");

        const { states, transitions, initialState, finalStates } = res.data;
        // console.log(res);

        cy.batch(function () {
          const initalStateId = [initialState.id];
          const finalStatesId = finalStates.map((s) => s.id);
          states.forEach((state) => {
            const id = state.id;
            const isInital = initalStateId.includes(id);
            const isFinal = finalStatesId.includes(id);
            cy.add({
              group: "nodes",
              data: { id: id, name: id, inital: isInital, final: isFinal },
            });
          });
          transitions.forEach((transition) => {
            const from = transition.from.id;
            const to = transition.to.id;
            const label = transition.myLabel || "ε";
            cy.add({
              group: "edges",
              data: {
                id: `${from}-${to}`,
                source: from,
                target: to,
                label: label,
              },
            });
          });
        });
        cy.layout({ name: "cose" }).run();
      });

    //  (a+b)* = (a*b*)*
  };

  return (
    <>
      <Button onClick={handleBtnConvert}>Convert RE to NFA</Button>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Input a regular expression"
      />
      {/* For the conversion */}
      <div id={CY_ID} className="cy"></div>
    </>
  );
}

export default REView;
