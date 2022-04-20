import { useState } from "react";
import { useInterval } from "react-use";

// const DEFAULT_INTERVAL
const slider_to_interval = (sliderValue) => (1000 * 10) / sliderValue;
const useFastrun = (cb, defaultInterval) => {
  const [running, setRunning] = useState(false);
  const [interval, setInterval] = useState(slider_to_interval(defaultInterval));

  useInterval(
    () => {
      console.log("[useFastrun] interval", interval);
      cb();
    },
    // Delay in milliseconds or null to stop it
    running ? interval : null
  );

  const updateInterval = (sliderValue) => {
    if (sliderValue === null) {
      setRunning(false);
    } else {
      const interval = slider_to_interval(sliderValue); // sliderValue; // times(value) per second
      setInterval(interval);
    }
  };
  const toggleRunning = () => {
    setRunning((r) => !r);
  };

  return [running, toggleRunning, updateInterval];
};

export default useFastrun;
