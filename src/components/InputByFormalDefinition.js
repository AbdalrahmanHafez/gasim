import React, { useRef, useState, useEffect } from "react";
import {
  Radio,
  Dropdown,
  InputNumber,
  Form,
  Checkbox,
  Button,
  message,
  Menu,
  Select,
  Input,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import tabTypes from "../enums/tabTypes";
import "antd/dist/antd.css";
import steppingStrategies from "../enums/steppingStrategies";
import { parseExampleLabels } from "../Helpers/GraphLabel";
import InputLabel from "../components/InputLabel";

const InputByFormalDefinition = ({ ui }) => {
  // TODO: refactor this to its own logic file
  const [automataType, setAutomataType] = useState(tabTypes.FA);
  const [tapesCtr, setTapesCtr] = useState(1);
  const [statesCtr, setStatesCtr] = useState(1);
  const [transitionCtr, setTransitionCtr] = useState(1);
  const [finalStates, setFinalStates] = useState([]);

  const onFormSubmit = (values) => {
    const data = { ...values, finalStates: finalStates };
    console.log("Success:", data);
    const { fTrFrom, fTrFunc, fTrTo, simType, steppingStrategy } = data;
    // TODO: stub remove
    // const fTrFrom = [0, 1];
    // const fTrFunc = ["a", "c"];
    // const fTrTo = [1, 0];
    // const simType = tabTypes.FA;
    // const stepStrat = steppingStrategy.STEP_BY_STATE;
    // end of stub

    ui.createHeadlessCy();
    const cy = ui.cy;
    // q0 is always the inital state
    cy.add({
      group: "nodes",
      data: { id: "q0", name: "q0", inital: true, final: false },
    });
    finalStates.forEach((stateNr) =>
      cy.add({
        group: "nodes",
        data: {
          id: `q${stateNr}`,
          name: `q${stateNr}`,
          inital: false,
          final: true,
        },
      })
    );
    if (!(fTrFrom.length === fTrTo.length && fTrFunc.length === fTrTo.length)) {
      throw new Error("from, to and func must have the same length");
    }

    fTrFrom.forEach((from, i) => {
      const to = fTrTo[i];
      const trLabel = fTrFunc[i];
      cy.add({
        group: "edges",
        data: {
          id: `q${from}q${to}`,
          source: `q${from}`,
          target: `q${to}`,
          ...parseExampleLabels(trLabel, simType),
        },
      });
    });

    // Creating a new Sim
    ui.handleStartSimulationTODO(simType, steppingStrategy);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.info("Click on menu item.");
  };

  const opAutomata = [
    { label: tabTypes.FA, value: tabTypes.FA },
    { label: tabTypes.PDA, value: tabTypes.PDA },
    { label: tabTypes.TM, value: tabTypes.TM },
  ];

  const displaySteppingStrategy = () => {
    const options = Object.entries(steppingStrategies).map(([key, value]) => (
      <Radio value={value} key={key}>
        {value}
      </Radio>
    ));
    if (automataType === tabTypes.TM) {
      // delete the first item from options "step with closure"
      return options.slice(1);
    }
    return options;
  };

  const handleAddFinalState = (key) => {
    if (finalStates.includes(key)) return;
    setFinalStates([...finalStates, key]);
  };
  const handleRemoveFinalState = (key) => {
    setFinalStates(finalStates.filter((state) => state !== key));
  };

  return (
    <>
      <h2>Input by Formal Definition</h2>

      <Form
        labelCol={{
          span: 0,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          simType: tabTypes.FA,
        }}
        onFinish={onFormSubmit}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item label="Simulation Type:" name="simType">
          <Radio.Group
            options={opAutomata}
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => setAutomataType(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Stepping Strategy" name="steppingStrategy">
          <Radio.Group optionType="button" buttonStyle="solid">
            {displaySteppingStrategy()}
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Number of States:" help="q0 is the inital state">
          <InputNumber
            style={{ width: 50 }}
            min={1}
            value={statesCtr}
            onChange={(value) => setStatesCtr(value)}
          />
        </Form.Item>
        {automataType === tabTypes.TM && (
          <Form.Item label="Number of Tapes:">
            <InputNumber
              style={{ width: 50 }}
              min={1}
              value={tapesCtr}
              onChange={(v) => setTapesCtr(v)}
            />
          </Form.Item>
        )}

        <Form.Item label="Final States">
          <Dropdown
            overlay={() => {
              return (
                <Menu>
                  {Array(statesCtr)
                    .fill(0)
                    .map((_, i) => (
                      <Menu.Item
                        onClick={() => handleAddFinalState(i)}
                        key={i}
                      >{`q${i}`}</Menu.Item>
                    ))}
                </Menu>
              );
            }}
          >
            <Button>
              Add <DownOutlined />
            </Button>
          </Dropdown>
          <br />
          {finalStates.map((key, i) => (
            <span key={i}>
              <label>{`q${key}`}</label>
              <Button onClick={() => handleRemoveFinalState(key)}>✖</Button>
            </span>
          ))}
        </Form.Item>

        <Form.Item label="Transition Function">
          <Form.Item>
            <InputNumber
              style={{ width: 50 }}
              min={1}
              value={transitionCtr}
              onChange={(v) => setTransitionCtr(v)}
            />
          </Form.Item>
          {Array(transitionCtr)
            .fill(null)
            .map((_, i) => (
              <Input.Group key={i} compact>
                <Form.Item noStyle name={["fTrFrom", i]}>
                  <Select
                    options={Array(statesCtr)
                      .fill(null)
                      .map((_, i) => ({ label: `q${i}`, value: i }))}
                  />
                </Form.Item>
                <Input
                  style={{
                    width: 30,
                    pointerEvents: "none",
                  }}
                  placeholder="~"
                  disabled
                />
                <Form.Item noStyle name={["fTrFunc", i]}>
                  {/* <Input
                    // required TODO: add required
                    style={{
                      width: 100,
                      textAlign: "center",
                    }}
                    placeholder="Transition" //TODO: transition inputs based on machine type
                  /> */}
                  <InputLabel simType={automataType} tapesCtr={tapesCtr} />
                </Form.Item>
                <Input
                  style={{
                    width: 30,
                    pointerEvents: "none",
                  }}
                  placeholder="~"
                  disabled
                />
                <Form.Item noStyle name={["fTrTo", i]}>
                  <Select
                    options={Array(statesCtr)
                      .fill(null)
                      .map((_, i) => ({ label: `q${i}`, value: i }))}
                  />
                </Form.Item>
              </Input.Group>
            ))}
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Simulate
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default InputByFormalDefinition;
