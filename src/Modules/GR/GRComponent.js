import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form, Space, Checkbox } from "antd";
import GRModel, { GrammarParser } from "./GRModel";
import { useInterval } from "react-use";

import "./GrammarView.css";
const EditableContext = React.createContext(null);

const Epsilonify = (value) => (value ? value : "ε");
const Deepsilonify = (value) => (value === "ε" ? "" : value);

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

const productionToData = (productionArray) =>
  productionArray.map((prod, idx) => ({
    key: "" + idx,
    from: prod[0],
    to: Epsilonify(prod[1]),
  }));

const GRComponent = ({ model }) => {
  console.log("GrammarView grammar is ", model);

  const [data, setData] = useState(
    model ? productionToData(model.productions) : null
  );

  useEffect(() => {
    setData(model ? productionToData(model.productions) : null);
  }, [model]);

  return <EditableTable dataSource={data} setDataSource={setData} />;
};

export default GRComponent;
