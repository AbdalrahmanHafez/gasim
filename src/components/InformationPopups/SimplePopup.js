import React from "react";
import { InfoCircleOutlined, InfoOutlined } from "@ant-design/icons";

function SimplePopup({ options }) {
  return (
    <InfoCircleOutlined
      style={{
        cursor: "pointer",
        marginBottom: 1,
      }}
      onClick={() => {
        // window.introJs().start();
        window.introJs().setOptions(options).start();
      }}
    />
  );
}

export default SimplePopup;
