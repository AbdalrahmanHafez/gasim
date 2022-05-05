import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { grammarExamples, machineExamples } from "../Helpers/Constatns";
import GrammarView from "./GrammarView";
import axios from "axios";
import Grammar from "../classes/Grammar";
import { verifyInitalStateExists, verifyOnlyOneFinalState } from "../utils";

const CY_ID = "PDAtoGrammar-CY";

function PDAtoGrammar({ ui }) {
  const [grammar, setGrammar] = useState(null);

  const handleBtnClick = () => {
    console.log("PDAtoGrammar clicked");
    const cy = ui.getCy();

    // Graph validity checks
    // TODO:
    if (!verifyInitalStateExists(cy) || !verifyOnlyOneFinalState(cy)) return;
    // must pop 1 push 0 or 2
    for (let edge of cy.edges()) {
      const { symbol, pop, push } = edge.data("labelData");
      //   TODO: make PDAlabelData epsilon to be an empty string
      if (
        pop.length === 1 &&
        pop !== "ε" &&
        (push === "ε" || push.length === 0 || push.length === 2)
      ) {
        if (edge.target().data("final")) {
          // transition to final must pop only Z
          if (pop !== "Z" && symbol === "ε" && push === "ε") {
            alert("Transition to final state must pop only Z");
            return;
          }
        }
      } else {
        alert("Graph Transitions must pop 1 character, push 0 or 2 characters");
        return;
      }
    }

    const nodes = cy.nodes().map((n) => ({
      id: n.data("id"),
      inital: n.data("inital"),
      final: n.data("final"),
    }));
    const edges = cy.edges().map((e) => {
      const { symbol, pop, push } = e.data("labelData");
      return {
        source: e.data("source"),
        target: e.data("target"),
        symbol: symbol === "ε" ? "" : symbol,
        pop: pop === "ε" ? "" : pop,
        push: push === "ε" ? "" : push.split("").reverse().join(""),
      };
    });
    const graphData = { nodes, edges };
    const graphDataStr = JSON.stringify(graphData);

    axios
      .post(
        `http://localhost:5050/js`,
        `code=edu.duke.cs.jflap.JFLAP.PDAtoGrammar('${encodeURIComponent(
          graphDataStr
        )}');`
      )
      .then((res) => {
        console.log("grammar is ", res.data);
        const newGrammar = new Grammar(
          res.data.map((prod) => [prod.myLHS, prod.myRHS])
        );
        setGrammar(newGrammar);
      });
  };

  useEffect(() => {
    console.log("[PDAtoGrammar] useEffect");
    ui.injectMachineCy(CY_ID, machineExamples.empty);

    const cy = ui.getCy();
  }, []);

  return (
    <>
      <Button onClick={handleBtnClick}>Convert PDA to Grammar</Button>

      <div id={CY_ID} className="cy"></div>

      <GrammarView grammar={grammar} />
    </>
  );
}

export default PDAtoGrammar;
