import { DataGrid, GridCellEditStopReasons } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { Input, Typography, Button } from "antd";
import TextField from "@mui/material/TextField";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { v4 as uuidv4 } from "uuid";
import { addElementsToCy, injectEmptyCy, getNodeClosure } from "../utils";
import AutomatonToDFA from "../Modules/Exercises/Classes/AutomatonToDFA";
import FSAModel from "../Modules/FSA/FSAModel";
import REModel from "../Modules/RE/REModel";
import DFAEquality from "../Modules/Exercises/Classes/DFAEquality";
import FSAComponent from "../Modules/FSA/FSAComponent";

const { Text, Link } = Typography;

const TestPage = () => {
  const nfaA = new FSAModel({
    nodes: [
      {
        data: { id: "a", name: "a", inital: true, final: false },
      },
      {
        data: { id: "b", name: "b", inital: false, final: false },
      },
      {
        data: { id: "s", name: "s", inital: false, final: false },
      },
      { data: { id: "f", name: "f", inital: false, final: true } },
    ],
    edges: [
      { data: { id: "ab", source: "a", target: "b", label: "a" } },
      { data: { id: "bf", source: "b", target: "f", label: "b" } },
      { data: { id: "as", source: "a", target: "s", label: "ε" } },
      { data: { id: "sb", source: "s", target: "b", label: "ε" } },
    ],
  });

  const nfaB = new FSAModel({
    nodes: [
      {
        data: { id: "a", name: "a", inital: true, final: false },
      },
      {
        data: { id: "b", name: "b", inital: false, final: false },
      },
      { data: { id: "f", name: "f", inital: false, final: true } },
    ],
    edges: [
      { data: { id: "ab", source: "a", target: "b", label: "a" } },
      { data: { id: "bf", source: "b", target: "f", label: "b" } },
    ],
  });

  const nfaC = new FSAModel({
    nodes: [
      {
        data: { id: "a", name: "a", inital: true, final: false },
      },
      {
        data: { id: "b", name: "b", inital: false, final: false },
      },
      { data: { id: "f", name: "f", inital: false, final: true } },
    ],
    edges: [
      { data: { id: "ab", source: "a", target: "b", label: "a" } },
      { data: { id: "abe", source: "a", target: "b", label: "ε" } },
      { data: { id: "bf", source: "b", target: "f", label: "b" } },
    ],
  });

  const [modelA, setmodelA] = useState(nfaA);
  const [modelB, setmodelB] = useState(nfaB);

  const [inputvalue, setinputvalue] = useState("ab*(c)");

  const cya = useRef(null);
  const cyb = useRef(null);

  useEffect(() => {}, [cya, cyb]);

  const compareDFA = () => {
    const converter = new AutomatonToDFA();

    const a = converter.convertFSA(modelA);
    const b = converter.convertFSA(modelB);
    console.log("a after conversion", a);
    console.log("b after conversion", b);

    console.log("equality result", DFAEquality(a, b));
  };

  const convertREtoDFA = () => {
    const converter = new AutomatonToDFA();
    const resultDfa = converter.convert(new REModel(inputvalue));
    console.log("result RE to DFA", resultDfa);

    cya.current.json({ elements: resultDfa.elements });
  };

  // TODO: test if inital and final state at the same node
  return (
    <div>
      <Input
        value={inputvalue}
        onChange={(e) => setinputvalue(e.target.value)}
        placeholder="regex"
      />
      <Button
        onClick={() => {
          compareDFA();
        }}
      >
        compare DFA
      </Button>
      <Button
        onClick={() => {
          convertREtoDFA();
        }}
      >
        convert RE to DFA
      </Button>
      <div style={{ display: "flex" }}>
        <FSAComponent
          model={modelA}
          cyref={cya}
          updateModel={(model) => setmodelA(model)}
        />
        <FSAComponent
          model={modelB}
          cyref={cyb}
          updateModel={(model) => setmodelB(model)}
        />
      </div>
    </div>
  );
};

export default TestPage;
