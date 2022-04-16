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
  Space,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import tabTypes from "../enums/tabTypes";
import "antd/dist/antd.css";
import steppingStrategies from "../enums/steppingStrategies";
import { parseExampleLabels } from "../Helpers/GraphLabel";
import InputLabel from "../components/InputLabel";

const InputByFormalDefinition = ({ ui, tabInfo, setTabInfo }) => {
  // TODO: refactor this to its own logic file
  // const [automataType, setAutomataType] = useState(tabTypes.FA);
  const automataType = tabInfo.simType;
  const setAutomataType = (simType) => {
    setTabInfo({ ...tabInfo, simType: simType });
  };

  const [tapesCtr, setTapesCtr] = useState(1);
  const [statesCtr, setStatesCtr] = useState(1);
  const [transitionCtr, setTransitionCtr] = useState(1);
  const [finalStates, setFinalStates] = useState([]);

  const onFormSubmit = (values) => {
    const data = { ...values, finalStates: finalStates };
    console.log("Success:", data);
    const { fTrFrom, fTrFunc, fTrTo, simType, steppingStrategy } = data;

    // check for valid input
    if (
      [fTrFrom, fTrFunc, fTrTo].some((arr) =>
        arr.some((elm) => elm === undefined)
      )
    ) {
      message.info("Invalid Transition input, please check your input");
      return;
    }

    ui.createHeadlessCy();
    const cy = ui.cy;
    // Clear evrything from graph, since might still states from previous run
    cy.elements().remove();

    // adding q0, is always the inital state
    cy.add({
      group: "nodes",
      data: { id: "q0", name: "q0", inital: true, final: false },
    });
    // Adding normal states
    for (let i = 1; i < statesCtr; i++) {
      cy.add({
        group: "nodes",
        data: {
          id: `q${i}`,
          name: `q${i}`,
          inital: false,
          final: false,
        },
      });
    }
    // update already created nodes with  Final states
    finalStates.forEach((stateNr) =>
      cy.nodes("#q" + stateNr).data("final", true)
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
    ui.handleStartSimulationTODO(simType, steppingStrategy, tapesCtr);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.info("Invalid Transition input");
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

        <Form.Item
          label="Stepping Strategy"
          name="steppingStrategy"
          rules={[{ required: true, message: "Please select a choice" }]}
        >
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
          <Space size="middle">
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
            {finalStates.map((key, i) => (
              <span key={i}>
                <label>{`q${key}`}</label>
                <Button onClick={() => handleRemoveFinalState(key)}>✖</Button>
              </span>
            ))}
          </Space>
        </Form.Item>

        <Form.Item label="Transition Function">
          <Form.Item help="space to insert empty or blank symbol">
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
              <Input.Group key={i} compact required>
                <Form.Item noStyle name={["fTrFrom", i]} required>
                  <Select
                    required
                    options={Array(statesCtr)
                      .fill(null)
                      .map((_, i) => ({ label: `q${i}`, value: i }))}
                  />
                </Form.Item>
                <Form.Item noStyle name={["fTrFunc", i]}>
                  {/* <Input
                    // required TODO: add required
                    style={{
                      width: 100,
                      textAlign: "center",
                    }}
                    placeholder="Transition" //TODO: transition inputs based on machine type
                  /> */}
                  <InputLabel
                    required
                    simType={automataType}
                    tapesCtr={tapesCtr}
                  />
                </Form.Item>
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
