import React, { useState, useRef } from "react";
import GRComponent from "./GRComponent";
import { Table, Input, Button, Popconfirm, Form, Space, Checkbox } from "antd";
import GRModel from "./GRModel";

const Epsilonify = (value) => (value ? value : "ε");
const Deepsilonify = (value) => (value === "ε" ? "" : value);
const dataToProductions = (data) =>
  data.map((row) => [row.from, Deepsilonify(row.to)]);

function GRView({ model }) {
  const [, forceRender] = useState({});

  const [showSim, setShowSim] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [simData, setSimData] = useState([]);
  const [simStep, setSimStep] = useState(1);
  const [simUserInput, setSimUserInput] = useState("");

  const handleBtnStart = async () => {
    console.log("Started");

    setSimRunning(true);
    // const grammar = new GRModel(dataToProductions(data));
    const inputData = simUserInput.trim();
    const displayData = model.bruteForceTo(inputData);
    console.log("found the resutls");
    console.log(displayData);
    setSimData(displayData);
    setSimRunning(false);
    setSimStep(1);
  };

  const handleBtnPause = () => {
    // MAYBE: PASUE simulation
    console.log("PAUSE");
    setSimRunning(false);
  };

  const handleBtnStep = () => {
    console.log("STEP");
    setSimStep((simStep) => simStep + 1);
  };

  const simColumns = [
    {
      title: "Production",
      dataIndex: "from",
      width: "30%",
    },
    {
      title: "Derivation",
      dataIndex: "to",
      width: "30%",
    },
  ];

  const format_sim_ds = (data) => {
    return data
      .map(([prod, string], i) => ({
        key: i,
        from: `${Epsilonify(prod[0])} -> ${Epsilonify(prod[1])}`,
        to: string,
      }))
      .slice(0, simStep);
  };
  const label_what_happens = () => {
    if (simRunning) return "Calculating ...";
    if (simData.length === 0) return "Input string to begin";

    const [prod, string] = simData[simStep - 1];
    const [from, to] = prod;
    if (from === undefined && to === undefined)
      return "Press Step to show derivations";
    return `Derived ${Epsilonify(to)} from ${Epsilonify(from)}`;
  };

  return (
    <>
      <button onClick={() => setShowSim(true)}>simulate</button>
      <h5>
        leave cell empty to indicate 'ε'. First production must start with S
      </h5>
      <Space direction="horizontal" align="start" size="large">
        <div style={{ minWidth: "30em" }}>
          <GRComponent model={model} />
        </div>

        {showSim && (
          <div>
            <h4 style={{ margin: "auto" }}>{label_what_happens()}</h4>
            <Input
              value={simUserInput}
              onChange={(e) => setSimUserInput(e.target.value)}
              placeholder="Enter target string"
              style={{ marginBottom: "0.40em" }}
            />
            <Space size="small">
              <Button
                type="primary"
                disabled={simRunning}
                onClick={handleBtnStart}
              >
                Start
              </Button>
              <Button disabled={!simRunning} onClick={handleBtnPause}>
                Pause
              </Button>
              <Button
                disabled={!(!simRunning && simStep < simData.length)}
                onClick={handleBtnStep}
              >
                Step
              </Button>
              {/* <Checkbox>Show all</Checkbox> */}
            </Space>
            <Table
              pagination={false}
              dataSource={format_sim_ds(simData)}
              columns={simColumns}
              bordered
            />
          </div>
        )}
      </Space>
    </>
  );
}

// MAYBE: grammar worker interval ?
// useInterval(() => {
//   console.log("interval");
//   setConsideredNodesCtr(consideredNodesCtr + 1);
//   if (parser.current !== null) {
//     parser.current.paused = true;
//   }
// }, 1000);

export default GRView;
