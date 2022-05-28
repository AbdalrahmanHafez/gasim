import { DataGrid, GridCellEditStopReasons } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { Typography, Button } from "antd";
import TextField from "@mui/material/TextField";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { v4 as uuidv4 } from "uuid";
import { addElementsToCy, injectEmptyCy, getNodeClosure } from "../utils";
import AutomatonToDFA from "../Modules/Exercises/Classes/AutomatonToDFA";

const { Text, Link } = Typography;

const TestPage = () => {
  const CY_ID = `cy-${uuidv4()}`;
  const cy = useRef(null);

  useEffect(() => {
    if (cy) cy.current = injectEmptyCy(CY_ID);
  }, [cy]);

  return (
    <div>
      <Button
        onClick={() => {
          const c = new AutomatonToDFA();
          const result = c.test();
          console.log(result);
          cy.current.json({ elements: JSON.parse(result) });
        }}
      >
        TEST AutomatonToDFA
      </Button>
      <Button
        onClick={() => {
          console.log(JSON.stringify(cy.current.json().elements));
        }}
      >
        SHOW BTN
      </Button>
      <div id={CY_ID} className="cy"></div>;
    </div>
  );
};

export default TestPage;
