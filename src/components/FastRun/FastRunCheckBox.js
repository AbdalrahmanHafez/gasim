import React from "react";
import { Checkbox } from "antd";
function FastRunCheckBox({ stChecked }) {
  const [checked, setChecked] = stChecked;
  return (
    <div id="ckbFastrun">
      <Checkbox
        id="ckbFastrun"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      >
        FastRun
      </Checkbox>
    </div>
  );
}

export default FastRunCheckBox;
