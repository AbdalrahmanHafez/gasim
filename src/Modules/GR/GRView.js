import React, { useState, useRef, useEffect, useContext } from "react";
import GRComponent from "./GRComponent";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  Space,
  Typography,
  Popover,
} from "antd";
import GRModel from "./GRModel";
import { conversionBus, eventTypes } from "../../Events";
import { GRtoPDAComponent } from "../Conversion";
import ExportButton from "../../components/ExportButton";
import tabTypes from "../../enums/tabTypes";
import { PDAModel } from "../PDA";
import { StoreContext } from "../../Store";
import { grammarExamples } from "../../Helpers/Constatns";
const { Text, Link } = Typography;

const Epsilonify = (value) => (value ? value : "ε");
const Deepsilonify = (value) => (value === "ε" ? "" : value);
const dataToProductions = (data) =>
  data.map((row) => [row.from, Deepsilonify(row.to)]);

function GRView({ model, updateModel }) {
  const [, forceRender] = useState({});

  // const [showSim, setShowSim] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [simData, setSimData] = useState([]);
  const [simStep, setSimStep] = useState(1);
  const [simUserInput, setSimUserInput] = useState("");

  const [GRtoPDAModel, setGRtoPDAModel] = useState(null);
  const [idxToShow, setIdxToShow] = useState(null);

  const [cykIsDerivable, setCykIsDerivable] = useState(null);

  useEffect(() => {
    // Conversion event from menu bar
    conversionBus.on(eventTypes.GRtoPDA, (GRtoPDAModel) => {
      console.log("GRView recived conversion model ", GRtoPDAModel);
      setGRtoPDAModel(GRtoPDAModel);
      setIdxToShow(1);
    });
  }, []);

  const handleOnchagneStringInput = (e) => {
    const inputString = e.target.value.trim();

    setSimUserInput(inputString);

    if (inputString.length === 0) {
      setCykIsDerivable(null);
    } else {
      try {
        const isDerivable = model.isDerivable(inputString);

        console.log(isDerivable);
        setCykIsDerivable(isDerivable);
      } catch (error) {
        alert(error);
      }
    }
  };

  const handleBtnStart = async () => {
    console.log("Started");
    const inputData = simUserInput;

    if (!model.isDerivable(inputData)) {
      alert(
        "CYK algorithm says input is not derivable, bruteforcing either way!, the cyk algo is only applicable for Context Free Grammars"
      );

      // return;
    }

    setSimRunning(true);
    // const grammar = new GRModel(dataToProductions(data));
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

  function displayRightSide() {
    if (idxToShow === null) return null;
    if (idxToShow === 0)
      return (
        <div>
          <h4 style={{ margin: "auto" }}>{label_what_happens()}</h4>
          <Input
            value={simUserInput}
            onChange={(e) => handleOnchagneStringInput(e)}
            placeholder="Enter target string"
            style={{ marginBottom: "0.40em" }}
          />

          <Space align="baseline" size="small" className="mb-1">
            <Button
              type="primary"
              disabled={simRunning}
              onClick={handleBtnStart}
            >
              BruteForce
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

            <h4>
              CYK algorithm:{" "}
              {cykIsDerivable === null
                ? "_"
                : cykIsDerivable
                ? "Derivable"
                : "NOT Derivable"}
            </h4>

            {/* <Popover content="if start variable derives lambda, the grammar fed into CYK algo will not contain this produced lambda string">
              <Text type="secondary" italic>
                warnning
              </Text>
            </Popover> */}
          </Space>
          <Table
            pagination={false}
            dataSource={format_sim_ds(simData)}
            columns={simColumns}
            bordered
          />
        </div>
      );

    if (idxToShow === 1)
      // TODO: style span the avaible width
      return (
        <div>
          <ExportButton
            tabObj={{ title: "Result GRtoPDA", tabType: tabTypes.PDA }}
            modelEvalFn={() => new PDAModel(GRtoPDAModel.exportResult)}
          />
          <div style={{ minWidth: "60em" }}>
            <GRtoPDAComponent model={GRtoPDAModel} />
          </div>
        </div>
      );

    throw new Error("Unknown index to show inside GRView");
  }

  const handleBtnSimulate = () => {
    // Verify model values are correct
    console.log("Model productions", model.productions);
    setIdxToShow(0);
  };

  const { store, setStore } = useContext(StoreContext);

  const handleTempExamle = (model) => {
    setStore((prevStore) => {
      const newStore = [...prevStore];
      newStore[1] = {
        ...prevStore[1],
        model: new GRModel(model),
      };
      return newStore;
    });
  };

  return (
    <>
      <Button onClick={handleBtnSimulate}>Simulate</Button>

      <Button onClick={() => handleTempExamle(grammarExamples.g1)}>g1</Button>
      <Button onClick={() => handleTempExamle(grammarExamples.g2)}>g2</Button>
      <Button onClick={() => handleTempExamle(grammarExamples.g3)}>g3</Button>
      <Button onClick={() => handleTempExamle(grammarExamples.g4)}>g4</Button>
      <Button onClick={() => handleTempExamle(grammarExamples.g5)}>g5</Button>
      <Button onClick={() => handleTempExamle(grammarExamples.g6)}>g6</Button>
      <Button onClick={() => handleTempExamle(grammarExamples.g7)}>g7</Button>
      <Button onClick={() => handleTempExamle(grammarExamples.g8)}>g8</Button>
      <Button onClick={() => handleTempExamle(grammarExamples.g9)}>g9</Button>
      <Button onClick={() => handleTempExamle(grammarExamples.g10)}>g10</Button>

      {/* <Button onClick={() => model.isDerivable("ab")}>CNF</Button> */}
      <h5>
        leave cell empty to indicate 'ε'. First production must start with S
      </h5>
      <Space direction="horizontal" align="start" size="large">
        <div style={{ minWidth: "28em" }}>
          <GRComponent
            model={model}
            updateModel={updateModel}
            editable={true}
          />
        </div>

        {displayRightSide()}

        {idxToShow !== null && (
          <Button onClick={() => setIdxToShow(null)}>&#10005;</Button>
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
