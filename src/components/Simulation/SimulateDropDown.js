import React from "react";
import DropDown from "../DropDown";
import { DownOutlined } from "@ant-design/icons";

function SimulateDropDown(props) {
  return (
    <div id="btnSimulate">
      <DropDown {...props}>
        {"Simulate  "}
        <DownOutlined />
      </DropDown>
    </div>
  );
}

export default SimulateDropDown;
