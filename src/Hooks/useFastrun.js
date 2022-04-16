import { useState } from "react";
import { useInterval } from "react-use";

// const DEFAULT_INTERVAL

const useFastrun = (cb, defaultInterval) => {
  const [running, setRunning] = useState(false);
  const [interval, setInterval] = useState(defaultInterval);

  useInterval(
    () => {
      cb();
    },
    // Delay in milliseconds or null to stop it
    running ? interval : null
  );

  const updateInterval = (sliderValue) => {
    if (sliderValue === null) {
      setRunning(false);
    } else {
      const interval = 1000 / sliderValue; // times(value) per second
      setInterval(interval);
    }
  };
  const toggleRunning = () => {
    setRunning((r) => !r);
  };

  return [running, toggleRunning, updateInterval];
};

export default useFastrun;
