import React from "react";
import { InfoCircleOutlined, InfoOutlined } from "@ant-design/icons";
import useTracking from "../../Hooks/useTracking";

function SimplePopup({ options }) {
  const { trackButtonClick } = useTracking();

  return (
    <InfoCircleOutlined
      style={{
        cursor: "pointer",
        marginBottom: 1,
      }}
      onClick={() => {
        // window.introJs().start();
        trackButtonClick("SimplePopup");
        window.introJs().setOptions(options).start();
      }}
    />
  );
}

export default SimplePopup;
