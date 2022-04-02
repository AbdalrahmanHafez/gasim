import React, { useEffect } from "react";
import App from "../../App";
import steppingStrategy from "../../enums/steppingStrategy";

const $ = window.jQuery;
let started = false;
export const SimTesting = () => {
  useEffect(() => {
    // ui.handleStartSimulation(steppingStrategy[0]);

    const func = (e) => {
      if (started) {
        document.getElementById("testStepAll").click();
        return;
      }
      if (e.key === " ") {
        console.clear();
        document.getElementById("testButton").click();
        started = true;
      }
    };
    document.addEventListener("keypress", func);

    return () => {
      document.removeEventListener("keypress", func);
    };
  }, []);

  return (
    <>
      <App />
    </>
  );
};
