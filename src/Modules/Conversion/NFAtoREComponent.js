import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { addElementsToCy, injectEmptyCy, getNodeClosure } from "../../utils";
import { Button, Input } from "antd";

function NFAtoREComponent({ model }) {
  const [inputValue, setInputValue] = useState("Loading...");

  useEffect(() => {
    async function fetchData() {
      console.log("[NFAtoREcomponent] useEffect");

      const resultREexp = await model.convert();
      setInputValue(resultREexp);
    }

    fetchData();
  }, []);

  return (
    <Input value={inputValue} />
    // <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
  );
}

export default NFAtoREComponent;
