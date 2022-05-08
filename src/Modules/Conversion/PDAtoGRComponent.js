import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { addElementsToCy, injectEmptyCy, getNodeClosure } from "../../utils";
import { GRComponent } from "../../Modules/GR";

function PDAtoGRComponent({ model }) {
  const [displayedGRModel, setDisplayedGRModel] = useState(null);

  useEffect(() => {
    console.log("[REtoNFACompoenn] useEffect");

    model.convert(setDisplayedGRModel);
  }, []);

  return (
    <div>
      <div>
        {displayedGRModel === null ? "Loading..." : "Resulting Grammar:"}
      </div>
      <GRComponent
        model={displayedGRModel}
        updateModel={() => {}}
        editable={false}
      />
    </div>
  );
}

export default PDAtoGRComponent;
