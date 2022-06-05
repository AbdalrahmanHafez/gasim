import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Typography,
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  Space,
  Checkbox,
} from "antd";
import GRModel, { GrammarParser } from "./GRModel";
import { DataGrid, GridCellEditStopReasons } from "@mui/x-data-grid";
import { useInterval } from "react-use";
import TextField from "@mui/material/TextField";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import "./GrammarView.css";

const { Text, Link } = Typography;
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
            required: title === "To" ? true : false,
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
        onMouseEnter={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const EditableTable = (props) => {
  const { dataSource, setDataSource, editable } = props;

  const allowEdits = editable ? true : false;

  const columns = [
    {
      title: "From",
      dataIndex: "from",
      width: "30%",
      editable: allowEdits,
    },
    {
      title: "",
      render: () => <span>&rarr;</span>,
    },
    {
      title: "To",
      dataIndex: "to",
      width: "30%",
      editable: allowEdits,
    },
    {
      title: "",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 && editable ? (
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
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const handleAdd = () => {
    const count = dataSource.length;
    const newData = {
      key: count,
      from: "?",
      arrow: "--->",
      to: "?",
    };

    setDataSource([...dataSource, newData]);
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
      {allowEdits && (
        <Button
          onClick={handleAdd}
          type="default"
          style={{
            marginBottom: 16,
            marginTop: 5,
          }}
        >
          Add a row
        </Button>
      )}
    </div>
  );
};

const GRTable = ({ dataSource, setDataSource, editable }) => {
  // const [rows, setRows] = useState([
  //   { id: 1, From: "S", To: "AB|CAA" },
  //   { id: 2, From: "A", To: "CA" },
  // ]);

  const handleRemoveRow = (id) => {
    // setRows(rows.filter((row) => row.id !== id));
    setDataSource(dataSource.filter((row) => row.id !== id));
  };

  return (
    <div>
      <div>
        <DataGrid
          experimentalFeatures={{ newEditingApi: true }}
          sx={{
            fontSize: 17,
          }}
          columns={[
            {
              field: "From",
              editable: true,
              flex: 1,
              // renderEditCell: (props) => {
              //   const { error } = props;

              //   return (
              //     <Tooltip open={!!error} title={error}>
              //       <TextField label="Outlined" variant="outlined" {...props} />
              //     </Tooltip>
              //   );
              // },

              // preProcessEditCellProps: (params) => {
              //   const hasError = params.props.value.length === 0;
              //   if (hasError) {
              //     params.props.value = "?";
              //   }
              //   return { ...params.props, error: hasError };
              // },
            },
            {
              field: "arrow",
              headerName: "",
              width: 50,
              renderCell: (d) => <div>&rarr;</div>,
            },
            {
              field: "To",
              editable: true,
              flex: 1,
              valueParser: (value, params) => {
                if (value.split("").includes(" ")) {
                  return value.replace(" ", "ε");
                }

                return value;
              },
            },
            {
              field: "removeBtn",
              headerName: "",
              flex: 1,
              hide: !editable,
              renderCell: (d) => (
                <Text
                  style={{ color: "rgb(59 130 246)" }}
                  className="no-underline hover:underline"
                  key={d.id}
                  onClick={() => handleRemoveRow(d.id)}
                >
                  remove
                </Text>
              ),
            },
          ]}
          onProcessRowUpdateError={(error) => {
            console.log("GRComponent error", error);
          }}
          processRowUpdate={(newRow, oldRow) => {
            // model.productions = model.productions.flatMap((prod) => {
            //   const [from, to] = prod;
            //   const isEmpty = (v) => v === undefined || v === null || v === "";
            //   if (
            //     isEmpty(from) ||
            //     isEmpty(to) ||
            //     from.split("").includes(" ") ||
            //     to.split("").includes(" ") ||
            //     from.split("").includes("?") ||
            //     to.split("").includes("?")
            //   ) {
            //     throw new Error("Production can't contain empty string");
            //   }
            //   if (from.split("").includes("ε") || from.split("").includes("|")) {
            //     throw new Error("Right hand side can't have epsilon or '|'");
            //   }
            //   let newProds = [];
            //   const rhsSegs = to.split("|");
            //   rhsSegs.forEach((rhs) => {
            //     newProds.push([from, rhs]);
            //   });
            //   return newProds;
            // });

            const { id, From, To } = newRow;
            let newData = [...dataSource];
            newData[id] = { ...newData[id], From, To };

            try {
              newData = newData.flatMap((prod) => {
                const { From, To } = prod;
                const isEmpty = (v) =>
                  v === undefined || v === null || v === "";
                if (
                  isEmpty(From) ||
                  isEmpty(To) ||
                  From.split("").includes(" ") ||
                  To.split("").includes(" ")
                ) {
                  throw new Error("Production can't contain empty string");
                }
                if (
                  From.split("").includes("ε") ||
                  From.split("").includes("|")
                ) {
                  throw new Error("Right hand side can't have epsilon or '|'");
                }

                let newProds = [];
                const rhsSegs = To.split("|");
                rhsSegs.forEach((rhs) => {
                  const newRhs = rhs.split("").includes("ε")
                    ? rhs.replace("ε", "")
                    : rhs;
                  newProds.push({ ...prod, From: From, To: newRhs });
                });

                return newProds;
              });
            } catch (error) {
              alert(error);
              return oldRow;
            }
            // console.log("after", newData);
            setDataSource(newData);

            return newRow;
          }}
          onCellEditStop={(param) => {
            // console.log("param is ", param); // field formattedValue id
          }}
          rows={dataSource}
          autoHeight={true}
          hideFooter={true}
        />

        {editable && (
          <Button
            onClick={() => {
              setDataSource([
                ...dataSource,
                { id: dataSource.length + 1, From: "?", To: "?" },
              ]);
            }}
          >
            Add Row
          </Button>
        )}
      </div>
    </div>
  );
};

const productionToData = (productionArray) =>
  productionArray.map((prod, idx) => ({
    key: "" + idx,
    from: prod[0],
    to: Epsilonify(prod[1]),
  }));

const productionToData2 = (productionArray) =>
  productionArray.map((prod, idx) => ({
    id: idx,
    From: prod[0],
    To: Epsilonify(prod[1]),
  }));

const dataToProductions = (data) => data.map((row) => [row.From, row.To]);

const GRComponent = ({ model, updateModel, editable }) => {
  // console.log("GrammarCompoenent grammar is ", model);

  // by default it's editable, unless specified

  const setDataSource = (newData) => {
    // console.log("settingDataSource", newData);
    console.log("settingDataSource ", dataToProductions(newData));
    updateModel(new GRModel(dataToProductions(newData)));
  };

  // const data = model === null ? [] : productionToData(model.productions);
  const data = model === null ? [] : productionToData2(model.productions);

  // return (
  //   <EditableTable
  //     dataSource={data}
  //     setDataSource={setDataSource}
  //     editable={editable}
  //   />
  // );
  return (
    <div>
      <GRTable
        dataSource={data}
        setDataSource={setDataSource}
        editable={editable}
      />
    </div>
  );
};

export default GRComponent;
