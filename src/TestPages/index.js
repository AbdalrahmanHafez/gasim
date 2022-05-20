import { DataGrid, GridCellEditStopReasons } from "@mui/x-data-grid";
import { useRef, useState } from "react";
import { Typography, Button } from "antd";
import TextField from "@mui/material/TextField";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
const { Text, Link } = Typography;

const TestPage = () => {
  const [rows, setRows] = useState([
    { id: 1, From: "S", To: "AB|CAA" },
    { id: 2, From: "A", To: "CA" },
  ]);

  const handleRemoveRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  return (
    <div>
      <div>
        <DataGrid
          experimentalFeatures={{ newEditingApi: true }}
          sx={{
            fontSize: 25,
          }}
          // valueParser, valueSetter
          // TODO: Bigger font size
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
              renderCell: (d) => "-->",
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
          rows={rows}
          autoHeight={true}
          hideFooter={true}
        />

        <Button
          onClick={() => {
            setRows((prevRows) => [
              ...prevRows,
              { id: prevRows.length + 1, From: "?", To: "?" },
            ]);
          }}
        >
          Add Row
        </Button>
      </div>
    </div>
  );
};

export default TestPage;
