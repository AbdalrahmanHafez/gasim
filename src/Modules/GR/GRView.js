import React, { useState, useRef } from "react";
import GRComponent from "./GRComponent";

function GRView({ model }) {
  const [, forceRender] = useState({});

  return <GRComponent model={model} />;
}

export default GRView;
