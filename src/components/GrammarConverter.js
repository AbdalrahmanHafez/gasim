import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form, Space, Checkbox } from "antd";
import Grammar, { GrammarParser } from "../classes/Grammar";
import { useInterval } from "react-use";
import { machineExamples } from "../Helpers/Constatns";

import "./GrammarView.css";
const EditableContext = React.createContext(null);
const Epsilonify = (value) => (value ? value : "ε");
function GrammarConverter({ ui, grammer }) {
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
        dataIndex: "arrow",
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

  const [data, setData] = useState([
    {
      key: "0",
      from: "S",
      arrow: "-->",
      to: "AB",
    },
    {
      key: "1",
      from: "A",
      arrow: "-->",
      to: "aA",
    },
    {
      key: "2",
      from: "A",
      arrow: "-->",
      to: "",
    },
    {
      key: "3",
      from: "B",
      arrow: "-->",
      to: "bB",
    },
    {
      key: "4",
      from: "B",
      arrow: "-->",
      to: "",
    },
  ]);

  const dataToProductions = (data) => data.map((row) => [row.from, row.to]);

  useEffect(() => {
    console.log("UseEffect Grammar to PDA");
    // setTimeout(() => {
    ui.injectMachineCy("gramToPDA", machineExamples.empty);
    // }, 1000);
  }, []);

  const getRHSTerminals = (productions) => {
    const terminals = new Set();
    const rhs = productions
      .map((p) => p[1])
      .join("")
      .split("");

    rhs.forEach((char) => {
      if (char.toLowerCase() === char && char !== " ") terminals.add(char);
    });
    return Array.from(terminals);
  };

  const handleBtnStart = () => {
    console.log("Converting.");
    // TODO: Fix the constant labelData
    const cy = ui.getCy();

    const terminalTransitions = getRHSTerminals(dataToProductions(data)).map(
      (terminal) => ({
        data: {
          id: "q" + terminal,
          source: "q1",
          target: "q1",
          // label: "ε, Z; ε",
          label: `${terminal}, ${terminal}; ε`,
          labelData: { symbol: terminal, pop: terminal, push: "ε" },
        },
      })
    );

    const productionTransitions = dataToProductions(data).map((production) => {
      let [from, to] = production;
      to = to === " " ? "ε" : to;
      return {
        data: {
          id: `q${from}${to}`,
          source: "q1",
          target: "q1",
          label: `ε, ${from}; ${to}`,
          labelData: { symbol: "ε", pop: from, push: to },
        },
      };
    });

    cy.add({
      nodes: [
        {
          data: { id: "q0", name: "q0", inital: true, final: false },
        },
        {
          data: { id: "q1", name: "q1", inital: false, final: false },
        },
        {
          data: { id: "q2", name: "q2", inital: false, final: true },
        },
      ],
      edges: [
        {
          data: {
            id: "q0q1",
            source: "q0",
            target: "q1",
            label: "ε, Z; SZ",
            labelData: { symbol: "ε", pop: "Z", push: "SZ" },
          },
        },
        {
          data: {
            id: "q1q2",
            source: "q1",
            target: "q2",
            label: "ε, Z; ε",
            labelData: { symbol: "ε", pop: "Z", push: "ε" },
          },
        },
        ...terminalTransitions,
        ...productionTransitions,
      ],
    });

    cy.layout({ name: "cose" }).run();
  };

  return (
    <>
      <h5>
        leave cell empty to indicate 'ε'. First production must start with S
      </h5>
      {/* <Space size="small"> */}
      <div style={{ minWidth: "30em" }}>
        <EditableTable dataSource={data} setDataSource={setData} />
      </div>

      <button onClick={handleBtnStart}>Convert Grammar to PDA</button>

      <div id="gramToPDA" className="cy"></div>
      {/* </Space> */}
    </>
  );
}

export default GrammarConverter;
