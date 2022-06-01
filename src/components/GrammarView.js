import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form, Space, Checkbox } from "antd";
import Grammar, { GrammarParser } from "../classes/Grammar";
import { useInterval } from "react-use";

import "./GrammarView.css";
const EditableContext = React.createContext(null);

const Epsilonify = (value) => (value ? value : "ε");

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const EditableTable = (props) => {
  const { dataSource, setDataSource } = props;

  const columns = [
    {
      title: "From",
      dataIndex: "from",
      width: "30%",
      editable: true,
    },
    {
      title: "",
      render: () => <span>&rarr;</span>,
    },
    {
      title: "To",
      dataIndex: "to",
      width: "30%",
      editable: true,
    },
    {
      title: "",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          // <Popconfirm
          //   title="Sure to delete?"
          //   onConfirm={() => handleDelete(record.key)}
          // >
          //   <a>Remove</a>
          // </Popconfirm>
          <a onClick={() => handleDelete(record.key)}>Remove</a>
        ) : null,
    },
  ];

  const handleDelete = (key) => {
    setDataSource((dataSource) =>
      dataSource.filter((item) => item.key !== key)
    );
  };
  const handleAdd = () => {
    const count = dataSource.length;
    const newData = {
      key: count,
      from: "?",
      arrow: "--->",
      to: "?",
    };

    setDataSource((dataSource) => [...dataSource, newData]);
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });

    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const rendredColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });
  return (
    <div>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        dataSource={dataSource}
        columns={rendredColumns}
        pagination={false}
        bordered
      />
      <Button
        onClick={handleAdd}
        type="default"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button>
    </div>
  );
};

const dataToProductions = (data) => data.map((row) => [row.from, row.to]);
const productionToData = (productionArray) =>
  productionArray.map((prod, idx) => ({
    key: "" + idx,
    from: prod[0],
    to: Epsilonify(prod[1]),
  }));

const GrammarView = ({ ui, grammar }) => {
  console.log("GrammarView grammar is ", grammar);

  const [data, setData] = useState(
    (grammar && productionToData(grammar.productions)) || null
  );

  useEffect(() => {
    setData((grammar && productionToData(grammar.productions)) || null);
  }, [grammar]);

  const [showSim, setShowSim] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [simData, setSimData] = useState([]);
  const [simStep, setSimStep] = useState(1);
  const [simUserInput, setSimUserInput] = useState("");

  // useInterval(() => {
  //   console.log("interval");
  //   setConsideredNodesCtr(consideredNodesCtr + 1);
  //   if (parser.current !== null) {
  //     parser.current.paused = true;
  //   }
  // }, 1000);

  const handleBtnStart = async () => {
    console.log("Started");

    setSimRunning(true);
    const grammar = new Grammar(dataToProductions(data));
    const inputData = simUserInput.trim();
    const displayData = grammar.bruteForceTo(inputData);
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
        First production must start with S. Space in 'To' will insert 'ε'.
      </h5>
      <Space direction="horizontal" align="start" size="large">
        <div style={{ minWidth: "30em" }}>
          <EditableTable dataSource={data} setDataSource={setData} />
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
};

export default GrammarView;
