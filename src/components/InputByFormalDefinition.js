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
import steppingStrategy from "../enums/steppingStrategy";

const InputByFormalDefinition = ({ ui }) => {
  const [automataType, setAutomataType] = useState(tabTypes.FA);
  const [statesCtr, setStatesCtr] = useState(3);
  const [finalStates, setFinalStates] = useState([]);

  const opAutomata = [
    { label: tabTypes.FA, value: tabTypes.FA },
    { label: tabTypes.PDA, value: tabTypes.PDA },
    { label: tabTypes.TM, value: tabTypes.TM },
  ];

  const displaySteppingStrategy = () => {
    const options = Object.entries(steppingStrategy).map(([key, value]) => (
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

  const onFinish = (values) => {
    const data = { ...values, finalStates: finalStates };
    console.log("Success:", data);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.info("Click on menu item.");
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
          testing: "",
        }}
        onFinish={onFinish}
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
              value={statesCtr}
              onChange={(value) => setStatesCtr(value)}
            />
          </Form.Item>
          {Array(statesCtr)
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
                  <Input
                    required
                    style={{
                      width: 100,
                      textAlign: "center",
                    }}
                    placeholder="Transition" //TODO: transition inputs based on machine type
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

      <Button
        onClick={() => {
          console.log(ui);
          // ui.helpers.setShowSim(true);
        }}
      >
        TEST
      </Button>
    </>
  );
};

export default InputByFormalDefinition;
