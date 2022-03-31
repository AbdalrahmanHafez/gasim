import React, { useLayoutEffect, useEffect, useState } from "react";
import Sim from "./classes/Sim";
import DFA from "./classes/DFA";

const TestClasses = () => {
  const [, forceRender] = useState(0);
  const UiUpdater = () => {
    console.log("forcing render");
    forceRender({});
  };

  // const [red, setred] = useState(false);
  const [sim, setSim] = useState(new Sim(new DFA(), this));

  useEffect(() => {
    console.log("[TestClasses] UseEffect 1");
  }, []);

  return (
    <>
      <h1>testing</h1>
      <p>{JSON.stringify(sim)}</p>
      <button onClick={() => UiUpdater(sim.handleStart())}>Start</button>
      <button onClick={() => UiUpdater(sim.handleTick())}>Tick</button>
      {sim.red && (
        <div
          style={{ background: "red", width: 100, height: 100, color: "white" }}
        >
          RED
        </div>
      )}
    </>
  );
};

export default TestClasses;
